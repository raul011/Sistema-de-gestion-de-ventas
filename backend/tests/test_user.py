from django.test import TestCase
from django.db import connection

# Create your tests here.
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_registro_de_usuario():
    print("Base de datos en uso para tests:", connection.settings_dict['NAME'])
    client = APIClient()

    # Paso 1 – Registro (POST)
    data = {
        "username": "raul",
        "email": "raul@mail.com",
        "password": "claveSegura123"
    }

    response = client.post("/api/users/register/", data, format='json')
    assert response.status_code == 201  # o 200 si así está tu vista

    # Paso 2 – Verificar que el usuario fue creado (GET, si tienes un listado)
    # Este paso es opcional si el endpoint de listado requiere autenticación
