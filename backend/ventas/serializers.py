from rest_framework import serializers
from .models import Venta, DetalleVenta
from products.serializers import ProductSerializer  # importa tu serializer de Product
from users.models import CustomUser

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=DetalleVenta._meta.get_field('producto').remote_field.model.objects.all(),
        source='producto',
        write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = DetalleVenta
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True)
    cliente_username = serializers.SerializerMethodField()

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_username', 'fecha', 'total', 'detalles']

    def get_cliente_username(self, obj):
        return obj.cliente.username

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        venta = Venta.objects.create(**validated_data)
        for detalle in detalles_data:
            DetalleVenta.objects.create(venta=venta, **detalle)
        venta.calcular_total()
        return venta
