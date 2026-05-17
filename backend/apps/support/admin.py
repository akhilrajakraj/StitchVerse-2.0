from django.contrib import admin

from .models import (
    SupportAgentProfile,
    SupportTicket,
    SupportTicketMessage,
    Dispute,
)

@admin.register(SupportAgentProfile)
class SupportAgentProfileAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'user',
        'full_name',
        'phone',
    )
    
    
    search_fields = (
        'id',
    )

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'raised_by',
        'stitch_request',
        'design_order',
    )
    
    list_filter = (
        'status',
    )
    
    search_fields = (
        'id',
    )
  
@admin.register(SupportTicketMessage)
class SupportTicketMessageAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'ticket',
        'sender',
        'body',
    )
    
    
    search_fields = (
        'id',
    )

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'ticket',
        'raised_by',
        'status',
    )
    
    list_filter = (
        'status',
    )
    
    search_fields = (
        'id',
    )
