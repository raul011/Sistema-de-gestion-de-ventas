# credit/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreditPlanViewSet, InstallmentViewSet

router = DefaultRouter()
router.register(r"credit-plans", CreditPlanViewSet, basename="credit-plan")
router.register(r"installments", InstallmentViewSet, basename="installment")

urlpatterns = [
    path("", include(router.urls)),
]