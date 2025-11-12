"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),  # <- esta línea

    path('admin/', admin.site.urls),

    
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('users.urls')),  # <-- importante
    path('api/users/', include('users.urls')),
    path('api/store/', include('products.urls')),
    path('api/orders/', include('orders.urls')),  # <- esta línea
    path('api/payments/', include('payments.urls')),  # ← esta línea
    path('api/reviews/', include('reviews.urls')),  # <- esta línea
    path('api/roles/', include('roles.urls')),  # <-- Aquí
    path('api/proveedores/', include('proveedores.urls')),
    path('api/products/', include('products.urls')),
    path('api/compras/', include('compras.urls')),
    path('api/ventas/', include('ventas.urls')),
    path('api/reportes/', include('reportes.urls')),
    path("api/credit/", include("creditos.urls")),
    path('api/', include('tokens_dispositivos.urls')),


]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)