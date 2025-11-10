# app/serializers.py
from rest_framework import serializers
from .models import Reporte
from products.models import Product   # <- desde la app correcta
from ventas.models import Venta        # <- desde la app correcta
from django.contrib.auth.models import User  # Para referencia a usuarios si hace falta

# Serializer para productos
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# Serializer para ventas
class VentaSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)  # Para mostrar detalles del producto
    usuario = serializers.StringRelatedField(read_only=True)  # Opcional: si quieres mostrar el usuario que creó la venta

    class Meta:
        model = Venta
        fields = '__all__'

# Serializer para reportes
class ReporteSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)  # Muestra el username del usuario que generó el reporte

    class Meta:
        model = Reporte
        fields = '__all__'
