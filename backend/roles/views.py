from django.shortcuts import render
from rest_framework.views import APIView
from .models import Permission
from .serializers import PermissionSerializer
# Create your views here.
from rest_framework import status
from .serializers import RoleCreateSerializer
from rest_framework import generics
from .models import Role
from .serializers import RoleSerializer
from rest_framework.permissions import IsAuthenticated  # Solo usuarios autenticados
from rest_framework.response import Response

#estos son los endpoint
class RoleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

#vista para llevar permisos al front
class PermissionListView(APIView):
    permission_classes = [IsAuthenticated]  # opcional, si solo usuarios autenticados

    def get(self, request):
        permisos = Permission.objects.all()
        serializer = PermissionSerializer(permisos, many=True)
        return Response(serializer.data)
    
class RoleCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoleCreateSerializer(data=request.data)
        if serializer.is_valid():
            rol = serializer.save()  # guarda el rol y asigna permisos
            return Response({"message": "Rol creado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RoleDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        role = Role.objects.get(id=id)
        serializer = RoleSerializer(role)
        return Response(serializer.data)
    
class RoleUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        role = Role.objects.get(id=id)
        serializer = RoleCreateSerializer(role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Rol actualizado"})
        return Response(serializer.errors, status=400)
