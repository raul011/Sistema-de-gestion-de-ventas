# payments/views.py
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
import uuid

from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.http import JsonResponse
import stripe
from django.conf import settings
from rest_framework.response import Response
class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order_id = self.request.data.get("order_id")
        amount = self.request.data.get("amount")

        try:
            order = Order.objects.get(id=order_id, user=self.request.user)
        except Order.DoesNotExist:
            raise ValidationError({"order": "Orden no válida o no pertenece al usuario."})

        if hasattr(order, "payment"):
            raise ValidationError({"payment": "La orden ya tiene un pago registrado."})

        if float(amount) != float(order.total_price):
            raise ValidationError({"amount": "El monto no coincide con el total de la orden."})

        serializer.save(
            order=order,
            status="completed",
            paid_at=timezone.now(),
            transaction_id=self.request.data.get("transaction_id", str(uuid.uuid4()))
        )

class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)


stripe.api_key = settings.STRIPE_SECRET_KEY  # Debes tener esto en settings

class CreatePaymentIntentView(APIView):
    #permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount = float(request.data.get("amount", 0))
            if amount <= 0:
                return Response({"error": "Monto inválido"}, status=400)

            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe trabaja en centavos
                currency='usd',
                payment_method_types=['card'],
            )
            return Response({"clientSecret": intent.client_secret})
        except Exception as e:
            return Response({"error": str(e)}, status=500)



