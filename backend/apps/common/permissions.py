from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrReadOnly(BasePermission):
    """Anyone authenticated can read; only staff can mutate."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsOwnerOrStaff(BasePermission):
    """Owners can mutate their own object; staff can manage everything."""

    owner_fields = ('user', 'customer', 'reviewer', 'raised_by', 'recipient', 'payer')

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return any(getattr(obj, field, None) == request.user for field in self.owner_fields)
