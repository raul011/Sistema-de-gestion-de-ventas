from django.db import models
from proveedores.models import Proveedor
# Create your models here.
from products.models import Product  # Asegúrate de importar tu modelo de productos


class Compra(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Compra #{self.id} - {self.proveedor.nombre}"

    def calcular_total(self):
        total = sum(detalle.subtotal() for detalle in self.detalles.all())
        self.total = total
        self.save()
        return total


class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Product, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.producto.name} x {self.cantidad}"