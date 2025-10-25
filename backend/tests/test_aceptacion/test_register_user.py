import pytest
from pytest_bdd import scenario, given, when, then
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
@scenario('features/register_user.feature', 'Usuario se registra exitosamente')
def test_usuario_se_registra():
    pass

@given('no existe un usuario con email "raul@example.com"')
def no_existe_usuario():
    User.objects.filter(email="raul@example.com").delete()

@when('el usuario se registra con email "raul@example.com" y contraseña "12345678"')
def registrar_usuario():
    User.objects.create_user(username="raul", email="raul@example.com", password="12345678")

@then('el usuario con email "raul@example.com" debe existir en la base de datos')
def verificar_usuario():
    assert User.objects.filter(email="raul@example.com").exists()
