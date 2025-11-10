from django.core.management.base import BaseCommand
from products.models import Product, Category, ProductImage
from faker import Faker
import random
from django.core.files import File

class Command(BaseCommand):
    help = 'Seed de productos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--number',
            type=int,
            default=10,  # valor por defecto
            help='Número de registros a crear'
        )

    def handle(self, *args, **options):
        number = options['number']
        faker = Faker()

        # Seed categorías
        categories = []
        for _ in range(number):
            cat = Category.objects.create(
                name=faker.word(),
                description=faker.text()
            )
            categories.append(cat)

        # Seed productos
        for _ in range(number):
            prod = Product.objects.create(
                name=faker.word(),
                description=faker.text(),
                precio_compra=random.uniform(5, 50),
                precio_venta=random.uniform(10, 100),
                stock=random.randint(0, 50),
                category=random.choice(categories)
            )
            # Imagen opcional local (solo product1.jpg a product4.jpg)
            image_index = (_ % 4) + 1  # Esto hace que siempre use 1,2,3,4 y luego repite
            
            image_path = f'media/products/product{image_index}.jpg'
            with open(image_path, 'rb') as f:
                ProductImage.objects.create(
                    product=prod,
                    image=File(f, name=f'product{image_index}.jpg')
            )

        self.stdout.write(self.style.SUCCESS(f'Seeder: {number} productos y categorías creados'))
