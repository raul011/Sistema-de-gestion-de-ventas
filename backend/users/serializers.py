from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from roles.models import Role, CustomUserRole  # importa tus modelos de roles
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_id = serializers.IntegerField(write_only=True, required=False)  # ahora opcional

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role_id')

    def create(self, validated_data):
        # Si no viene role_id, asignamos el rol por defecto (Cliente)
        role_id = validated_data.pop('role_id', None)  # None si no viene
        if role_id is None:
            # Buscamos el rol "Cliente" en tu modelo Role
            cliente_role = Role.objects.get(name='Cliente')
            role_id = cliente_role.id

        # Creamos el usuario
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role_id=role_id
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='role.name', read_only=True)  # mostrar rol

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class UserUpdateSerializer(serializers.ModelSerializer):
    role_id = serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'role_id']

    def update(self, instance, validated_data):
        # actualizar campos básicos
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        # actualizar rol si existe el campo
        role_id = validated_data.get('role_id')
        if role_id:
            try:
                role = Role.objects.get(id=role_id)
                instance.role = role  # si el modelo User tiene role_id
            except Role.DoesNotExist:
                raise serializers.ValidationError({'role_id': 'Rol no válido.'})

        instance.save()
        return instance
