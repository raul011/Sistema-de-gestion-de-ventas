from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Proveedor
from .serializers import ProveedorSerializer

# Listar todos los proveedores
class ProveedorListView(generics.ListAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]

# Crear un proveedor
class ProveedorCreateView(generics.CreateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]

# Detalle y actualización de proveedor
class ProveedorDetailView(generics.RetrieveUpdateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

# Eliminar proveedor
class ProveedorDeleteView(generics.DestroyAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
