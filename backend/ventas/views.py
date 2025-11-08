from rest_framework import generics
from .models import Venta
from .serializers import VentaSerializer

class VentaListCreateView(generics.ListCreateAPIView):
    queryset = Venta.objects.all().order_by('-fecha')
    serializer_class = VentaSerializer

class VentaDetailView(generics.RetrieveAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
