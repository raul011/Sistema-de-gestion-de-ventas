from django.shortcuts import render

# Create your views here.
# credit/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import CreditPlan, Installment
from .serializers import CreditPlanSerializer, InstallmentSerializer
from .permissions import IsOwnerCreditPlan, IsOwnerInstallment
from orders.models import Order

class CreditPlanViewSet(viewsets.ModelViewSet):
    serializer_class = CreditPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CreditPlan.objects.filter(user=self.request.user).select_related("order").prefetch_related("installments")

    def perform_create(self, serializer):
        order_id = self.request.data.get("order")
        order = get_object_or_404(Order, id=order_id, user=self.request.user)
        serializer.save(user=self.request.user, order=order)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsOwnerCreditPlan])
    def confirm(self, request, pk=None):
        plan = self.get_object()
        if plan.is_confirmed:
            return Response({"detail": "El plan ya está confirmado."}, status=status.HTTP_400_BAD_REQUEST)
        plan.is_confirmed = True
        plan.generate_installments()
        plan.save()
        plan.refresh_from_db()

        return Response(CreditPlanSerializer(plan).data, status=status.HTTP_200_OK)

class InstallmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Installment.objects.filter(credit_plan__user=self.request.user).select_related("credit_plan")

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsOwnerInstallment])
    def pay(self, request, pk=None):
        installment = self.get_object()
        if installment.is_paid:
            return Response({"detail": "Esta cuota ya está pagada."}, status=status.HTTP_400_BAD_REQUEST)
        reference = request.data.get("payment_reference")
        # Here you would verify the payment with a gateway before marking as paid
        installment.mark_as_paid(reference=reference)
        return Response(InstallmentSerializer(installment).data, status=status.HTTP_200_OK)