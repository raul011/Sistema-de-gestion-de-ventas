from django.shortcuts import render
from rest_framework.permissions import AllowAny
# Create your views here.
from rest_framework import generics
from .models import Compra
from .serializers import CompraSerializer


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
