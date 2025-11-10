from django.db import models
from django.conf import settings  # <- importante para usar el modelo de usuario correcto

class Reporte(models.Model):
    TIPO_REPORTE = [
        ('ventas', 'Ventas'),
        ('inventario', 'Inventario'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tipo_reporte = models.CharField(max_length=20, choices=TIPO_REPORTE)
    filtros = models.JSONField(default=dict, blank=True)  # Guarda filtros como JSON
    formato = models.CharField(max_length=20, default='texto')  # texto, PDF, CSV, gráfico
    fecha_generacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_reporte} - {self.usuario.username} - {self.fecha_generacion}"
