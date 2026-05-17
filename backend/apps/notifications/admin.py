from django.contrib import admin

from .models import (
    Notification,
    NotificationTemplate,
    NotificationChannel,
)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'recipient',
        'template',
    )
    
    list_filter = (
        'channel',
    )
    
    search_fields = (
        'id',
    )

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'event_key',
        'subject',
    )
    
    list_filter = (
        'is_active',
    )
    
    search_fields = (
        'id',
    )