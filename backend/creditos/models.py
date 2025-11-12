# credit/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal, ROUND_HALF_UP
from orders.models import Order

def _round_money(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

class CreditPlan(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="credit_plan")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="credit_plans")
    weeks = models.PositiveIntegerField()  # e.g., 4
    monthly_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)  # e.g., 5.00 = 5%
    total_with_interest = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    def calculate_totals(self):
        """
        Simple interest: monthly_interest_rate applied proportionally to weeks.
        For 4 weeks ≈ 1 month. total_with_interest = total_price * (1 + monthly_rate/100 * (weeks/4)).
        Weekly installment derived from total_with_interest / weeks.
        """
        factor = (self.monthly_interest_rate / Decimal(100)) * Decimal(self.weeks) / Decimal(4)
        total = Decimal(self.order.total_price) * (Decimal(1) + factor)
        self.total_with_interest = _round_money(total)

    def generate_installments(self):
        if self.installments.exists():
            return
        self.calculate_totals()
        self.save()
        weekly_amount = _round_money(Decimal(self.total_with_interest) / Decimal(self.weeks))

        # Adjust the last installment to fix rounding drift
        remaining = Decimal(self.total_with_interest)
        for i in range(1, self.weeks + 1):
            amount = weekly_amount if i < self.weeks else _round_money(remaining)
            Installment.objects.create(
                credit_plan=self,
                week_number=i,
                amount=amount
            )
            remaining = _round_money(remaining - amount)

    def refresh_completion(self):
        all_paid = self.installments.filter(is_paid=False).count() == 0
        self.is_completed = all_paid
        if all_paid:
            self.order.is_paid = True
            self.order.save()
        self.save()

class Installment(models.Model):
    credit_plan = models.ForeignKey(CreditPlan, on_delete=models.CASCADE, related_name="installments")
    week_number = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=128, null=True, blank=True)  # transaction id from gateway

    class Meta:
        unique_together = ("credit_plan", "week_number")
        ordering = ["week_number"]

    def mark_as_paid(self, reference: str | None = None):
        if self.is_paid:
            return
        self.is_paid = True
        self.paid_at = timezone.now()
        if reference:
            self.payment_reference = reference
        self.save()
        self.credit_plan.refresh_completion()