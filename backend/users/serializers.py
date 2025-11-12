from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from roles.models import Role, CustomUserRole  # importa tus modelos de roles
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_id = serializers.IntegerField(write_only=True)  # agregamos role_id

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role_id')

    def create(self, validated_data):
        role_id = validated_data.pop('role_id')  # sacamos role_id de los datos
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role_id=role_id  # ⚡ asignamos directamente aquí
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
