from rest_framework.permissions import BasePermission

class IsOrderOwner(BasePermission):
    
    """
    Custom permission to allow only order owners to access or modify their orders.
    """
    
    def has_object_permission(self, request, view, obj):
        
        return obj.customer == request.user

class IsTailorAssigned(BasePermission):
    
    """
    Custom permission to allow only assigned tailors to access or modify orders.
    """
    
    def has_object_permission(self, request, view, obj):
        
        return obj.tailor == request.user
    
class IsOrderOwnerOrTailor(BasePermission):
    
    """
    Custom permission to allow order owners or assigned tailors to access or modify orders.
    """
    
    def has_object_permission(self, request, view, obj):
        
        return obj.customer == request.user or obj.tailor == request.user