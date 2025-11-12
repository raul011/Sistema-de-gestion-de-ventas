# credit/admin.py
from django.contrib import admin
from .models import CreditPlan, Installment

class InstallmentInline(admin.TabularInline):
    model = Installment
    extra = 0
    readonly_fields = ("week_number", "amount", "is_paid", "paid_at", "payment_reference")

@admin.register(CreditPlan)
class CreditPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "user", "weeks", "monthly_interest_rate", "total_with_interest", "is_confirmed", "is_completed", "created_at")
    inlines = [InstallmentInline]

@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ("id", "credit_plan", "week_number", "amount", "is_paid", "paid_at")
    list_filter = ("is_paid",)