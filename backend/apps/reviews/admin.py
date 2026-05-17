from django.contrib import admin

from .models import (
    Review,
)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    
    list_display = (
        'id',
        'reviewer',
        'tailor',
        'feedback_type',
    )
    
    list_filter = (
        'feedback_type',
    )
    
    search_fields = (
        'id',
    )