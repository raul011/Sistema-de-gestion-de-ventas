# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReporteViewSet

dinamico_view = ReporteViewSet.as_view({'post': 'dinamico'})

urlpatterns = [
    path('reportes/dinamico/', dinamico_view, name='reporte-dinamico'),
]
