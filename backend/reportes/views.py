# reportes/views.py
import requests
import json
import re
from django.utils import timezone
from datetime import datetime
from django.conf import settings
from django.db.models import Q
from django.core.exceptions import FieldError

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Reporte
from users.models import CustomUser
from ventas.models import Venta
from compras.models import Compra
from products.models import Product, Category
from proveedores.models import Proveedor

# Mapa de modelos disponibles (ajusta nombres si tus apps/modelos difieren)
MODEL_MAP = {
    "usuarios": CustomUser,
    "clientes": CustomUser,    # Usuarios con role 'cliente'
    "empleados": CustomUser,   # Usuarios con role 'empleado'
    "encargados": CustomUser,  # Usuarios con role 'encargado'
    "ventas": Venta,
    "compras": Compra,
    "productos": Product,
    "categorias": Category,
    "proveedores": Proveedor,
}
# Definir qué roles corresponden a cada "modelo" lógico
ROLE_MAP = {
    "clientes": "Cliente",
    "empleados": "Empleado",
    "encargados": "Encargado",
    "asistentes": "Asistente",
    "administradores": "Admin",
}

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = None  # No exponemos todo directamente; lo puedes ajustar si necesitas

    @action(detail=False, methods=['post'])
    def dinamico(self, request):
        usuario = request.user
        prompt = request.data.get('prompt', '')

        if not prompt:
            return Response({"error": "No se recibió prompt"}, status=400)

        # URL de Gemini (usa la clave en settings.GEMINI_API_KEY)
        api_url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            "models/gemini-2.5-flash:generateContent"
            f"?key={settings.GEMINI_API_KEY}"
        )

        instruction = (
            "Eres un asistente que interpreta instrucciones de reportes de la base de datos. "
            "Devuelve un JSON con la siguiente estructura: "
            '{"modelo":"usuarios|ventas|compras|productos|categorias|proveedores", '
            '"filtros": { <campo>: <valor> , ... } } '
            "para que Django aplique los filtros correctos. "
            "Si se pide por fechas, usa formato 'YYYY-MM-DD' y si es un rango, estructura el filtro "
            "como { \"campo\": { \"inicio\": \"YYYY-MM-DD\", \"fin\": \"YYYY-MM-DD\" } } "
            "o bien utiliza claves 'inicio' y 'fin' al nivel raíz para referirse al campo 'fecha'."
        )

        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": instruction + " Prompt: " + prompt}]}
            ]
        }

        # Llamada a Gemini
        try:
            response = requests.post(api_url, json=payload, timeout=15)
            data_ia = response.json()
            print("Respuesta completa de Gemini:", data_ia)
            filtros_texto = data_ia["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            # devolvemos 503 si hay problema de red/IA
            return Response({"error": "Error al llamar a Gemini", "detalle": str(e)}, status=503)

        # Limpiar texto devuelto por Gemini (quita ```json … ``` si existe)
        texto_limpio = re.sub(r"```json|```", "", filtros_texto).strip()

        # Intentar convertir a JSON
        try:
            filtros = json.loads(texto_limpio)
        except json.JSONDecodeError:
            print("❌ Error al interpretar el JSON devuelto por Gemini:")
            print(filtros_texto)
            return Response({"error": "Error al interpretar la respuesta de la IA"}, status=400)

        print("✅ Filtros interpretados:", filtros)

        # Extraer modelo y filtros
        modelo_nombre = filtros.get("modelo")
        filtros_modelo = filtros.get("filtros", {})

        if not modelo_nombre or modelo_nombre not in MODEL_MAP:
            return Response({"error": f"Modelo no válido o no especificado: {modelo_nombre}"}, status=400)
        
        Modelo = MODEL_MAP[modelo_nombre]
        # 🔹 Manejar roles específicos si el modelo es User
        # Para CustomUser, filtrar por role
        q_obj = Q()
        print("🧭 Modelo recibido:", modelo_nombre)
        print("📜 ROLE_MAP contiene:", ROLE_MAP.keys())
        if modelo_nombre in ROLE_MAP:
            role_name = ROLE_MAP[modelo_nombre]
            queryset = CustomUser.objects.filter(role__name=role_name)
            print(f"Usuarios encontrados ({queryset.count()}): {[user.username for user in queryset]}")

        elif modelo_nombre == "compras":
            # --- Filtrar compras por proveedor ---
            proveedor_nombre = filtros_modelo.get("proveedor")
            proveedor_id = filtros_modelo.get("proveedor_id")
            if proveedor_id:
                print("aaaaaaaaaaaaaaaaaaaaaa")
                queryset = Compra.objects.filter(proveedor__id=proveedor_id)
                print(f"🛒 Compras filtradas por ID de proveedor {proveedor_id}: {queryset.count()} resultados")
            elif proveedor_nombre:
                q_obj &= Q(proveedor__nombre__icontains=proveedor_nombre)
            else:
                queryset = Compra.objects.all()
                print("📦 Mostrando todas las compras (sin filtro de proveedor)")
        else:        
            queryset = Modelo.objects.all()
            print(f"✅ Mostrando todos los registros del modelo: {modelo_nombre}")

        # Construir Q() dinámico con protecciones
        

        # Caso especial: si la IA devuelve 'inicio' y 'fin' al nivel raíz,
        # se interpreta como filtro por rango en el campo 'fecha'
        if "inicio" in filtros_modelo and "fin" in filtros_modelo:
             print("🔹 Filtro rango fecha hola mundo")
             inicio = filtros_modelo.get("inicio")
             fin = filtros_modelo.get("fin")
             if inicio and fin:


                  # Aplicar filtro a queryset
                  q_obj &= Q(fecha__range=[inicio, fin])
        else:
            # iterar por cada filtro devuelto
            for campo, valor in filtros_modelo.items():
                try:
                    # Si el valor es un dict con inicio/fin -> rango en ese campo
                    if isinstance(valor, dict) and "inicio" in valor and "fin" in valor:
                        inicio = valor.get("inicio")
                        fin = valor.get("fin")
                        if inicio and fin:
                            # Convertir strings a datetime
                            inicio_dt = datetime.strptime(inicio, "%Y-%m-%d")
                            fin_dt = datetime.strptime(fin, "%Y-%m-%d")

                            # Convertir a aware datetime con el timezone actual de Django
                            inicio_dt = timezone.make_aware(inicio_dt, timezone.get_current_timezone())
                            fin_dt = timezone.make_aware(fin_dt, timezone.get_current_timezone())

                            # Imprimir para verificación
                            print("holaaaaaaaaaaaaaa jhonyyyyyyyyyyyyyy",f"🔹 Campo: {campo}, Inicio: {inicio_dt}, Fin: {fin_dt}")

                            lookup = f"{campo}__range"
                            q_obj &= Q(**{lookup: [inicio_dt, fin_dt]})
                            # si faltan valores, ignorar el filtro
                    else:
                        # Intentamos aplicar el filtro directamente.
                        # Puede ser una lookup compleja (producto__categoria__name) o simple (fecha, total, etc.)
                        q_obj &= Q(**{campo: valor})
                except FieldError:
                    # Campo no existe en el modelo, lo ignoramos (no rompe la petición)
                    print(f"⚠️ Campo/lookup '{campo}' no existe para el modelo '{modelo_nombre}', se ignora.")
                except Exception as e:
                    # Cualquier otro error en la construcción del filtro se ignora y se registra
                    print(f"⚠️ Error aplicando filtro {campo}: {e}. Se ignora.")

        # Aplicar filtros
        try:
            print("🔹 Q object antes de filter:", q_obj)
            queryset = queryset.filter(q_obj)
            print("🔹 Queryset filtrado:", queryset)
        except Exception as e:
            # Si ocurre un error al filtrar (p. ej. lookup inválida), lo reportamos
            print("❌ Error aplicando filtros a queryset:", e)
            return Response({"error": "Error aplicando filtros al modelo", "detalle": str(e)}, status=400)

        # Convertir resultados a lista de diccionarios (values)
        try:
            resultado = list(queryset.values())
            print("🔹 Resultado final que se enviará al front:", resultado)
        except Exception as e:
            print("❌ Error convirtiendo queryset a lista:", e)
            return Response({"error": "Error procesando resultados"}, status=500)

        # Guardar historial (intenta guardar, si falla, lo ignoramos pero devolvemos data)
        try:
            reporte = Reporte.objects.create(
                usuario=usuario,
                tipo_reporte=modelo_nombre,
                filtros=filtros,
                formato="texto"
            )
            reporte_id = reporte.id
        except Exception as e:
            print("⚠️ No se pudo guardar el historial del reporte:", e)
            reporte_id = None

        return Response({"reporte_id": reporte_id, "data": resultado})
