from django.urls import path
from .views import PaymentCreateView, PaymentDetailView
from .views import CreatePaymentIntentView
urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('intent/', CreatePaymentIntentView.as_view())  # <- endpoint de stripe
]
