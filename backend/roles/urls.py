from django.urls import path
from .views import RoleListView
from .views import PermissionListView, RoleCreateView, RoleDetailView, RoleUpdateView

urlpatterns = [
    path('roles/', RoleListView.as_view(), name='roles-list'),
    path('ver/', RoleListView.as_view(), name='role-list'),
     path('permissions/', PermissionListView.as_view(), name='permissions-list'),
    path('add/', RoleCreateView.as_view(), name='roles-add'),
    path('<int:id>/', RoleDetailView.as_view(), name='role-detail'),
    path('<int:id>/edit/', RoleUpdateView.as_view(), name='role-edit'),
]
