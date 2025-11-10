from rest_framework import serializers
from .models import Category, Product
from decimal import Decimal

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description',
            'precio_compra', 'precio_venta',
            'stock', 'image', 'category', 'category_id'
        ]
        read_only_fields = ['precio_venta']  # se calculará automáticamente

    def create(self, validated_data):
        try:
            # 🔹 Calcular precio_venta antes de crear el producto
            precio_compra = validated_data.get('precio_compra', 0)
            validated_data['precio_venta'] = precio_compra * Decimal('1.3')  # usar Decimal

            print("💡 Datos validados recibidos en create:", validated_data)

            # Crear producto con precio_venta ya definido
            producto = Product.objects.create(**validated_data)
            print("✅ Producto creado:", producto)
            print("💰 Precio de venta calculado:", producto.precio_venta)

            return producto
        except Exception as e:
            print("❌ Error al crear producto:", e)
            raise e  # para que DRF lo capture y devuelva el error


