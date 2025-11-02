from django.urls import path
from .views import RegisterView, UserCreateView,  ProfileView, CurrentUserView, UserListView, UserDetailView, UserUpdateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserCreateView
urlpatterns = [
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('', UserListView.as_view(), name='users-list'),
    path('add/', UserCreateView.as_view(), name='users-add'),
    path('<int:id>/', UserDetailView.as_view(), name='users-detail'),  # GET para obtener usuario
    path('<int:id>/edit/', UserUpdateView.as_view(), name='users-edit'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),

]
