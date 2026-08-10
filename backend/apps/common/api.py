from rest_framework import permissions, viewsets


class OwnerOrReadOnly(permissions.BasePermission):
    """Object access helper for resources exposing an owner field."""
    owner_field = 'user'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, self.owner_field, None) == request.user


class UserScopedViewSet(viewsets.ModelViewSet):
    """Small reusable CRUD base for authenticated user-owned resources."""
    owner_field = 'user'

    def perform_create(self, serializer):
        serializer.save(**{self.owner_field: self.request.user})

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(**{self.owner_field: self.request.user})
