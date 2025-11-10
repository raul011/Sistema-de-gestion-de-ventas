import random
from django.core.management.base import BaseCommand
from faker import Faker
from compras.models import Compra, DetalleCompra
from proveedores.models import Proveedor
from products.models import Product

faker = Faker()

class Command(BaseCommand):
    help = 'Puebla la tabla Compra y DetalleCompra con datos de prueba'

    def add_arguments(self, parser):
        parser.add_argument('--number', type=int, default=10, help='Número de compras a crear')

    def handle(self, *args, **options):
        number = options['number']

        proveedores = list(Proveedor.objects.all())
        productos = list(Product.objects.all())

        if not proveedores or not productos:
            self.stdout.write(self.style.ERROR('Primero necesitas tener Proveedores y Productos creados.'))
            return

        for _ in range(number):
            proveedor = random.choice(proveedores)
            compra = Compra.objects.create(proveedor=proveedor)

            num_detalles = random.randint(1, 5)  # cada compra tendrá entre 1 y 5 productos
            total = 0

            for _ in range(num_detalles):
                producto = random.choice(productos)
                cantidad = random.randint(1, 10)
                precio_unitario = producto.precio if hasattr(producto, 'precio') else round(random.uniform(5, 100), 2)
                
                detalle = DetalleCompra.objects.create(
                    compra=compra,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=precio_unitario
                )
                total += detalle.subtotal()

            compra.total = total
            compra.save()

            self.stdout.write(self.style.SUCCESS(f'Compra #{compra.id} creada con total {compra.total}'))
