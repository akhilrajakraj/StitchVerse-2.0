from django.contrib import admin

from .models import (
    Payment,
    Refund,
)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'payer',
        'stitch_request',
    )
    
    list_filter = (
        'payment_mode',
    )
    
    search_fields = (
        'id',
    )
    
@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'payment',
        'amount',
    )
    
    list_filter = (
        'payment',
    )
    
    search_fields = (
        'id',
    )