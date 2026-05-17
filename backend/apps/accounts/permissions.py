from rest_framework.permissions import BasePermission

from .models import (
    UserRole,
    UserStatus,
)

class BaseRolePermission(BasePermission):
    """
    Base Permission for authenticated active users.
    """
    
    allowed_roles = []
    
    def has_permission(self, request, view):
        
        user = request.user
        
        return bool(
            user and 
            user.is_authenticated and
            user.is_active and 
            user.status == UserStatus.ACTIVE and 
            user.role in self.allowed_roles 
            
        )
    
        
class isVerifiedUser(BasePermission):
    
    """
    Allows only accessed to verified active users.
    """
    def has_permission(self, request, view):
        
        user=request.user
        
        return bool(
            user and 
            user.is_authenticated and
            user.is_active and 
            user.is_verified and 
            user.status == UserStatus.ACTIVE
        )
        
class IsCustomer(BaseRolePermission):
    
    """
    Allow access only to customers.
    """
    
    allowed_roles = [UserRole.CUSTOMER]
    
class IsTailor(BaseRolePermission):
    
    """
    Allow access only to tailors.
    """
    
    allowed_roles = [UserRole.TAILOR]
    
class IsDeliveryAgent(BaseRolePermission):
    
    """
    Allow access only to Delivery Agents.
    """
    
    allowed_roles = [UserRole.DELIVERY]

class IsSupportAgent(BaseRolePermission):
    
    """
    Allow access only to support agents.
    """
    allowed_roles = [UserRole.SUPPORT]
    
class IsPlatformStaff(BaseRolePermission):
    
    """
    Allowed acces only to platform staff.
    """
    allowed_roles = [UserRole.STAFF]

class IsAdminUser(BaseRolePermission):
    
    """
    Allwed access only to Admin.
    """
    allowed_roles = [UserRole.ADMIN]
    
class IsAdminOrStaff(BaseRolePermission):
    
    """
    Allowed access only to admin and staff.
    """
    allowed_roles = [
        UserRole.ADMIN,
        UserRole.STAFF,
    ]
    
    
        
        
        
        
        
    
        
    