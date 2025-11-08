from django.urls import path
from .views import (
    ProveedorListView,
    ProveedorCreateView,
    ProveedorDetailView,
    ProveedorDeleteView
)

urlpatterns = [
    path('ver/', ProveedorListView.as_view(), name='proveedores-list'),
    path('add/', ProveedorCreateView.as_view(), name='proveedores-add'),
    path('<int:id>/', ProveedorDetailView.as_view(), name='proveedores-detail'),
    path('<int:id>/edit/', ProveedorDetailView.as_view(), name='proveedores-edit'),
    path('<int:id>/delete/', ProveedorDeleteView.as_view(), name='proveedores-delete'),
]
