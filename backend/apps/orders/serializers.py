import datetime

from rest_framework import serializers

from apps.accounts.models import CustomUser, Measurement
from apps.accounts.serializers import UserSerializer
from apps.designs.models import Design

from .models import (
    DesignOrder,
    GarmentCategory,
    OrderStatusLog,
    StitchRequest,
    StitchRequestImage,
)


class StitchRequestImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StitchRequestImage
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class GarmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GarmentCategory
        fields = ['id', 'name', 'department', 'required_measurements']
        read_only_fields = ['id']


class CreateStitchRequestSerializer(serializers.ModelSerializer):
    garment_type = serializers.PrimaryKeyRelatedField(
        queryset=GarmentCategory.objects.filter(is_active=True)
    )
    tailor = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='tailor'),
        required=False,
        allow_null=True,
    )
    measurement = serializers.PrimaryKeyRelatedField(
        queryset=Measurement.objects.all(),
        required=False,
        allow_null=True,
    )
    reference_design = serializers.PrimaryKeyRelatedField(
        queryset=Design.objects.filter(is_active=True),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = StitchRequest
        fields = [
            'id', 'tailor', 'name', 'garment_type', 'fabric', 'color', 'pattern',
            'design_details', 'instructions', 'measurement', 'reference_design',
            'expected_date', 'quoted_price',
        ]
        read_only_fields = ['id']

    def validate(self, data):
        expected_date = data.get('expected_date')
        if expected_date and expected_date <= datetime.date.today():
            raise serializers.ValidationError({'expected_date': 'Expected date must be in the future.'})
        return data

    def validate_quoted_price(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Quoted price cannot be negative.')
        return value


class StitchRequestSerializer(serializers.ModelSerializer):
    images = StitchRequestImageSerializer(many=True, read_only=True)

    class Meta:
        model = StitchRequest
        fields = [
            'id', 'customer', 'tailor', 'name', 'garment_type', 'fabric', 'color',
            'pattern', 'design_details', 'instructions', 'measurement',
            'reference_design', 'expected_date', 'quoted_price', 'status',
            'submitted_at', 'updated_at', 'images',
        ]
        read_only_fields = ['id', 'customer', 'status', 'submitted_at', 'updated_at']


class StitchRequestDetailSerializer(StitchRequestSerializer):
    customer = UserSerializer(read_only=True)
    tailor = UserSerializer(read_only=True)
    garment_type = GarmentCategorySerializer(read_only=True)


class DesignOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignOrder
        fields = [
            'id', 'customer', 'design', 'quantity', 'unit_price', 'total_amount',
            'status', 'delivery_address', 'order_date', 'ordered_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'customer', 'unit_price', 'total_amount', 'status',
            'ordered_at', 'updated_at',
        ]


class OrderStatusLogSerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)

    class Meta:
        model = OrderStatusLog
        fields = [
            'id', 'stitch_request', 'from_status', 'to_status', 'changed_by',
            'note', 'changed_at',
        ]
        read_only_fields = ['id', 'changed_by', 'changed_at']
