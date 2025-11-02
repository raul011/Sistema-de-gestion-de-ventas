#!/bin/bash

# Ruta absoluta al proyecto Django
PROJECT_DIR="C:/Users/RAUL/Desktop/SI2PARCIAL2/backend"

# Moverse a la carpeta del proyecto
cd "$PROJECT_DIR" || {
    echo "❌ No se encontró la carpeta del proyecto en: $PROJECT_DIR"
    exit 1
}

# Detectar sistema operativo y activar entorno virtual
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    source venv/Scripts/activate
else
    # Linux o macOS
    source venv/bin/activate
fi

# Ejecutar el servidor Django
python manage.py runserver 0.0.0.0:8000
