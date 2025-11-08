from django.db import models
from users.models import CustomUser  # tu modelo de usuarios
from products.models import Product  # aquí cambió de Producto a Product

class Venta(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Venta #{self.id} - {self.cliente.username}"

    def calcular_total(self):
        total = sum(detalle.subtotal() for detalle in self.detalles.all())
        self.total = total
        self.save()
        return total

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Product, on_delete=models.CASCADE)  # Product aquí
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.producto.name} x {self.cantidad}"
