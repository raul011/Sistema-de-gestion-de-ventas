from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    CategoryListView,
    CategoryDetailView,
    related_products,
    CategoryCreateView,
    ProductCreateView
)

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('add/', ProductCreateView.as_view(), name='product-add'),  # ← nueva ruta
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('categories/add/', CategoryCreateView.as_view(), name='category-add'),  # ← nueva ruta
    path('products/<int:product_id>/related/', related_products, name='related-products'),
]
