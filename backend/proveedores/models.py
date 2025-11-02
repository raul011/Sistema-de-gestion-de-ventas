from django.db import models

# Create your models here.
class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.nombre