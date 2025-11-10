from django.core.management.base import BaseCommand
from faker import Faker
from proveedores.models import Proveedor  # Ajusta si tu app se llama diferente

fake = Faker()

class Command(BaseCommand):
    help = 'Pobla la base de datos con proveedores falsos'

    def add_arguments(self, parser):
        parser.add_argument('--number', type=int, default=10, help='Número de proveedores a crear')

    def handle(self, *args, **options):
        num = options['number']
        self.stdout.write(f'🌱 Creando {num} proveedores...')

        for _ in range(num):
            Proveedor.objects.create(
                nombre=fake.company(),
                correo=fake.company_email(),
                telefono=fake.phone_number()[:20],
                direccion=fake.address(),
            )

        self.stdout.write(f'✅ {num} proveedores creados.')
