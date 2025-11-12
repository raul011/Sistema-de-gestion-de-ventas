import os
import django
import random
import requests
from faker import Faker
from django.core.files.base import ContentFile

# ⚙️ Configurar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from products.models import Category, Product

fake = Faker('es_ES')
NUM_PRODUCTOS = 60  # cantidad de productos falsos

# 💃 Categorías típicas de una boutique
CATEGORIAS = [
    ("Blusas", "blouse"),
    ("Vestidos", "dress"),
    ("Pantalones", "pants"),
    ("Zapatos", "shoes"),
    ("Accesorios", "accessories"),
    ("Carteras", "handbags"),
]

def descargar_imagen(url, nombre):
    """Descarga una imagen y devuelve un ContentFile válido o None."""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200 and response.headers.get("Content-Type", "").startswith("image"):
            return ContentFile(response.content)
        else:
            print(f"⚠️ No se pudo descargar imagen para {nombre} ({response.status_code})")
    except Exception as e:
        print(f"⚠️ Error descargando {nombre}: {e}")
    return None

# 👜 Crear categorías con imagen
for nombre, keyword in CATEGORIAS:
    categoria, creada = Category.objects.get_or_create(name=nombre)
    if creada or not categoria.image:
        url = f"https://loremflickr.com/400/400/{keyword},fashion"
        contenido = descargar_imagen(url, nombre)
        categoria.description = fake.text(60)
        if contenido:
            categoria.image.save(f"{nombre}.jpg", contenido, save=True)
        categoria.save()
        print(f"🟩 Categoría creada: {nombre}")
    else:
        print(f"🟨 Categoría existente: {nombre}")

# 👗 Crear productos de boutique
NOMBRES_PRENDAS = [
    "Top Encaje", "Vestido Floral", "Jeans Skinny", "Falda Plisada", "Blusa Satinada",
    "Pantalón Palazzo", "Chaqueta Denim", "Cartera Elegante", "Sandalias Doradas",
    "Aretes de Perlas", "Collar Minimalista", "Zapatillas Blancas", "Bolso de Mano",
    "Camisa Oversize", "Falda de Cuero", "Vestido Casual", "Blazer Formal",
    "Botines Negros", "Cinturón de Cuero", "Sombrero de Ala Ancha"
]

for _ in range(NUM_PRODUCTOS):
    categoria = random.choice(Category.objects.all())
    name = f"{random.choice(NOMBRES_PRENDAS)} #{random.randint(1, 999)}"
    description = fake.sentence(nb_words=12)
    price = round(random.uniform(25, 180), 2)
    stock = random.randint(5, 30)

    # Imagen basada en la categoría
    query = categoria.name.replace(' ', '%20')
    #url_imagen = f"https://loremflickr.com/400/400/{query},fashion,women"
    url_imagen = f"https://loremflickr.com/400/400/fashion,boutique,women,clothes"
    contenido = descargar_imagen(url_imagen, name)

    producto = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=categoria,
    )
    if contenido:
        producto.image.save(f"{name}.jpg", contenido, save=True)
    else:
        producto.save()

    print(f"👗 Producto creado: {name} - {categoria.name} (${price})")

print("\n🎀 Boutique de prueba generada correctamente 🎀")