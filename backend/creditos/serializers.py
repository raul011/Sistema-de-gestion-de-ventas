# credit/serializers.py
from rest_framework import serializers
from .models import CreditPlan, Installment

class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = ["id", "week_number", "amount", "is_paid", "paid_at", "payment_reference"]

class CreditPlanSerializer(serializers.ModelSerializer):
    installments = InstallmentSerializer(many=True, read_only=True)

    class Meta:
        model = CreditPlan
        fields = [
            "id", "order", "user", "weeks", "monthly_interest_rate",
            "total_with_interest", "is_confirmed", "is_completed", "created_at",
            "installments",
        ]
        read_only_fields = ["user", "total_with_interest", "is_confirmed", "is_completed", "created_at", "installments"]