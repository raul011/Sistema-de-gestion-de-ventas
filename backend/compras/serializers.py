from rest_framework import serializers
from .models import Compra, DetalleCompra
from products.serializers import ProductSerializer


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
            DetalleCompra.objects.create(compra=compra, **detalle)
        compra.calcular_total()  # actualizar total después de crear detalles
        return compra