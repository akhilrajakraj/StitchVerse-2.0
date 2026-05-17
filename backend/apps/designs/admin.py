from django.contrib import admin

from .models import (
    Design,
    DesignCategory,
    DesignImage,
    DesignTag,
    DesignTagMap,
)

@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'tailor',
        'category',
        'name',
    )
    
    list_filter = (
        'category',
    )

    search_fields = (
        'tailor',
    )

@admin.register(DesignImage)
class DesignImageAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'design',
        'image',

    )
    
    list_filter = (
        'uploaded_at',
    )
    
    search_fields = (
        'id',
    )

@admin.register(DesignTag)
class DesignTagAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'name',
        'slug',
    )
    
    list_filter = (
        'id',
    )
    
    search_fields = (
        'name',
    )
    
@admin.register(DesignTagMap)
class DesignTagMapAdmin(admin.ModelAdmin):
    
    list_display = (
        'design',
        'tag',
    )
    
@admin.register(DesignCategory)
class DesignCategoryAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'name',
        'slug',
    )
    
    list_filter = (
        'id',
    )
    
    search_fields = (
        'name',
    )