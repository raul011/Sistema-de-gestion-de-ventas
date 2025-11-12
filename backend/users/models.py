from django.contrib.auth.models import AbstractUser
from django.db import models
from roles.models import Role  # importa tu modelo Role

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return self.username
