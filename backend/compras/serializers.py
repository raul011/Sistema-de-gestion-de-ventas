from rest_framework import serializers
from .models import Compra, DetalleCompra
from products.serializers import ProductSerializer
from decimal import Decimal
from ventas.models import Venta, DetalleVenta

class DetalleCompraSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=DetalleCompra._meta.get_field('producto').remote_field.model.objects.all(),
        source='producto',
        write_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = DetalleCompra
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()


class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)

    class Meta:
        model = Compra
        fields = ['id', 'proveedor', 'proveedor_nombre', 'fecha', 'total', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        compra = Compra.objects.create(**validated_data)

        for detalle in detalles_data:
            # Crear DetalleCompra
            detalle_obj = DetalleCompra.objects.create(compra=compra, **detalle)

            # Actualizar el precio de compra y venta del producto
            producto = detalle_obj.producto  # usar el objeto ya relacionado
            producto.precio_compra = detalle_obj.precio_unitario
            producto.precio_venta = producto.precio_compra * Decimal('1.3')  # margen 30%
            producto.stock = producto.stock + detalle_obj.cantidad  # 🔹 si la compra aumenta el stock
            producto.save()

        compra.calcular_total()  # actualizar total después de crear detalles
        return compra
    

    
    
class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario']

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True)
    cliente_nombre = serializers.CharField(source='cliente.username', read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_nombre', 'fecha', 'total', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        venta = Venta.objects.create(**validated_data)

        for detalle in detalles_data:
            detalle_obj = DetalleVenta.objects.create(venta=venta, **detalle)

            # Actualizar stock del producto
            producto = detalle_obj.producto
            if producto.stock < detalle_obj.cantidad:
                raise serializers.ValidationError(f"No hay suficiente stock para {producto.name}")
            producto.stock -= detalle_obj.cantidad
            producto.save()

        # Calcular total de la venta
        venta.total = sum(d.precio_unitario * d.cantidad for d in venta.detalles.all())
        venta.save()

        return venta