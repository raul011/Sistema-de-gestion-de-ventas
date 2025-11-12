from django.shortcuts import render
from rest_framework.permissions import AllowAny
# Create your views here.
from rest_framework import generics, permissions
from .models import Compra
from .serializers import CompraSerializer, VentaSerializer
from ventas.models import Venta

class CompraListCreateView(generics.ListCreateAPIView):
    queryset = Compra.objects.all().order_by('-fecha')
    serializer_class = CompraSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)  # instancia del serializer
        print(serializer.data)  # ✅ aquí sí puedes acceder a .data
        return super().list(request, *args, **kwargs)

# views.py
class CompraCreateView(generics.CreateAPIView):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [AllowAny]


class CompraDetailView(generics.RetrieveAPIView):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer

class VentaCreateView(generics.CreateAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [permissions.AllowAny]  # Si el cliente no está logueado, puedes usar JWT si quieres

    # Opcional: enviar notificación al admin
    def perform_create(self, serializer):
        venta = serializer.save()
        # Aquí podrías mandar evento WebSocket a la tienda
        # channel_layer.group_send('admins', {...})
