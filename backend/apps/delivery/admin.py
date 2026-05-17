from django .contrib import admin

from .models import (
    DeliveryStatus,
    DeliveryAgentProfile,
    DeliveryAssignment,
    DeliveryLocationLog,    
)

@admin.register(DeliveryAgentProfile)
class DeliveryAgentProfileAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'user',
        'full_name',
        'phone',
        'vehicle_type',
        'is_available',
    )
    
    list_filter = (
        'vehicle_type',
    )
    
    search_fields = (
        'id',
    )
    
@admin.register(DeliveryAssignment)
class DeliveryAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'stitch_request',
        'agent',
        'delivery_address',
        )
        
    list_display_links = (
        'id',
        )
        
    list_status = (
        'status',
        )
        
    list_filter = (
        'status',
        )
    search_fields = (
        'id',
        )

@admin.register(DeliveryLocationLog)
class DeliveryLocationLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'assignment',
        'latitude',
        'longitude',
        'recorded_at',
    )
    
    list_display_links = (
        'id',
    )
    
    search_fields = (
        'id',
    )
    