from django.core.management.base import BaseCommand
from faker import Faker
import random
from ventas.models import Venta, DetalleVenta
from users.models import CustomUser
from products.models import Product

fake = Faker()

class Command(BaseCommand):
    help = 'Pobla la base de datos con ventas falsas'

    def add_arguments(self, parser):
        parser.add_argument('--number', type=int, default=10, help='Número de ventas a crear')

    def handle(self, *args, **options):
        num = options['number']
        usuarios = list(CustomUser.objects.all())
        productos = list(Product.objects.all())

        if not usuarios:
            self.stdout.write(self.style.ERROR('❌ No hay usuarios para asignar ventas.'))
            return
        if not productos:
            self.stdout.write(self.style.ERROR('❌ No hay productos para asignar a las ventas.'))
            return

        self.stdout.write(f'🌱 Creando {num} ventas...')

        for _ in range(num):
            cliente = random.choice(usuarios)
            venta = Venta.objects.create(cliente=cliente)

            total_venta = 0
            # Cada venta tendrá entre 1 y 5 productos
            num_productos = random.randint(1, 5)
            productos_venta = random.sample(productos, k=num_productos)

            for prod in productos_venta:
                cantidad = random.randint(1, 5)
                precio_unitario = prod.precio_venta
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=prod,
                    cantidad=cantidad,
                    precio_unitario=precio_unitario
                )
                total_venta += cantidad * precio_unitario

            venta.total = total_venta
            venta.save()

        self.stdout.write(self.style.SUCCESS(f'✅ {num} ventas creadas.'))
