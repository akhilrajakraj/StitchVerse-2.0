from django.contrib import admin

from .models import (
    StitchRequest,
    StitchRequestImage,
    OrderStatusLog,
    DesignOrder,
)


@admin.register(StitchRequest)
class StitchRequestAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer',
        'tailor',
        'name',
        'garment_type',
        'status',
    )

    list_filter = (
        'status',
    )

    search_fields = (
        'id',
    )


@admin.register(StitchRequestImage)
class StitchRequestImageAdmin(admin.ModelAdmin):

    list_display = (
        'stitch_request',
        'image',
    )


@admin.register(OrderStatusLog)
class OrderStatusLogAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'stitch_request',
        'from_status',
    )


@admin.register(DesignOrder)
class DesignOrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer',
        'design',
        'quantity',
        'status',
    )