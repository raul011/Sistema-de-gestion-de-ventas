from django.urls import path
from .views import CompraListCreateView, CompraDetailView, CompraCreateView

urlpatterns = [
    path('', CompraListCreateView.as_view(), name='compra-list-create'),
    path('<int:pk>/', CompraDetailView.as_view(), name='compra-detail'),
    path('crear/', CompraCreateView.as_view(), name='compra-crear'),
]
