# credit/permissions.py
from rest_framework.permissions import BasePermission

class IsOwnerCreditPlan(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsOwnerInstallment(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.credit_plan.user == request.user