from django.shortcuts import render
from rest_framework.views import APIView
from .models import Permission
from .serializers import PermissionSerializer
# Create your views here.
from rest_framework import status, permissions
from .serializers import RoleCreateSerializer
from rest_framework import generics
from .models import Role, Permission
from .serializers import RoleSerializer
from rest_framework.permissions import IsAuthenticated  # Solo usuarios autenticados
from rest_framework.response import Response
from .models import CustomUserRole
from rest_framework.decorators import api_view, permission_classes


#estos son los endpoint
class RoleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

#vista para llevar permisos al front
class PermissionListCreateAPIView(APIView):
    def get(self, request):
        permissions = Permission.objects.all()
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PermissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class PermissionUpdateView(generics.UpdateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

# GET de un permiso específico
class PermissionDetailView(generics.RetrieveAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

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

# para obtener todos los permisos de un determinado rol
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_role_permissions(request):
    user = request.user
    role = user.role  # <-- directamente del modelo CustomUser

    if role:
        permissions = list(role.permissions.values_list('name', flat=True))
        return Response({
            "username": user.username,
            "role": role.name,
            "permissions": permissions
        })
    else:
        return Response({
            "username": user.username,
            "role": None,
            "permissions": []
        })