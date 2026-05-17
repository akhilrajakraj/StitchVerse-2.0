from django.contrib import admin

from .models import (
    CustomUser,
    Address,
    CustomerProfile,
    Measurement,
)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    
    list_display=(
        'email',
        'role',
        'status',
        'is_verified',
        'is_active',
        
    )
    
    search_field=(
        'email',
        'phone_number',
    )

    list_filter = (
        'role',
        'status',
        'is_verified',
    )



@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):

    list_display = (
        'city',
        'state',
        'country',
    )


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        
    )


@admin.register(Measurement)
class MeasurementAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
    )