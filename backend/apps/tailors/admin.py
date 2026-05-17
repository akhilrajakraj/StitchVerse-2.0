from django.contrib import admin

from .models import (
    TailorProfile,
)

@admin.register(TailorProfile)
class TailorProfileAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'user',
        'full_name',
        'specialisation',
    )
    
    list_filter = (
        'approval_status',
    )
    
    search_fields = (
        'id',
    )