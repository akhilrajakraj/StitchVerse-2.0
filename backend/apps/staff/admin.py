from django.contrib import admin

from .models import (
    QualityCheck,
    QualityCheckImage,
    QualityCheckResult,
    StaffProfile,
    AdminActionLog,
    PlatformConfig,
)

@admin.register(QualityCheck)
class QualityCheckAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'stitch_request',
        'inspector',
        'result',
    )
    
    list_filter = (
        'inspector',
    )
    
    search_fields = (
        'id',
    )

@admin.register(QualityCheckImage)
class QualityCheckImageAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'quality_check',
        'image',
        'uploaded_at',
    )
    
    list_filter = (
        'id',
    )
    
    search_fields = (
        'id',
    )
    
@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'user',
        'full_name',
        'department',
    )
    
    list_filter = (
        'department',
    )
    
    search_fields = (
        'id',
    )
    
@admin.register(AdminActionLog)
class AdminActionLogAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'admin',
        'action',
        'target_type',
    )
    
    search_fields = (
        'id',
    )

@admin.register(PlatformConfig)
class PlatformConfigAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'key',
        'value',
        'value_type',
    )
    
    search_fields = (
        'id',
    )
    