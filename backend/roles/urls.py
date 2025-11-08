from django.urls import path
from .views import RoleListView
from .views import PermissionListView,PermissionDetailView, RoleCreateView, RoleDetailView, RoleUpdateView, PermissionUpdateView

urlpatterns = [
    path('roles/', RoleListView.as_view(), name='roles-list'),
    path('ver/', RoleListView.as_view(), name='role-list'),
    path('permissions/<int:id>/', PermissionDetailView.as_view(), name='permissions-detail'),
    path('permissions/ver/', PermissionListView.as_view(), name='permissions-list'),#esta ruta es para ver los permisos
    path('permissions/<int:id>/edit/', PermissionUpdateView.as_view(), name='permissions-edit'),
    path('add/', RoleCreateView.as_view(), name='roles-add'),
    path('<int:id>/', RoleDetailView.as_view(), name='role-detail'),
    path('<int:id>/edit/', RoleUpdateView.as_view(), name='role-edit'),
]
