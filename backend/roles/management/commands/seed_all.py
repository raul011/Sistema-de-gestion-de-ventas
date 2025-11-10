from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = "Ejecuta todos los seeds de la base de datos"

    def add_arguments(self, parser):
        parser.add_argument(
            '--number',
            type=int,
            default=10,
            help='Número de registros por tabla (aproximado)'
        )

    def handle(self, *args, **options):
        number = options['number']

        self.stdout.write("🌱 Iniciando seed global...")

        # Ejecutar seeds específicos de cada app
        seeds = [
            ('products', 'seed_products'),   # comando que creaste para productos/categorías
            ('proveedores', 'seed_proveedores'),
            ('compras', 'seed_compras'),
            ('ventas', 'seed_ventas'),
        ]

        for app, command in seeds:
            self.stdout.write(f"➡ Ejecutando {command} ({app})...")
            call_command(command, number=number)

        self.stdout.write(self.style.SUCCESS("✅ Seed global completado!"))
