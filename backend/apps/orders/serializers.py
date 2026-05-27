from rest_framework import serializers
import datetime

from .models import (
    GarmentCategory,
    StitchRequest,
    StitchRequestImage,
    DesignOrder,
    OrderStatusLog,
)
from apps.accounts.serializers import (
    UserSerializer,
)

class StitchRequestImageSerializer(serializers.ModelSerializer):

    """
    Serializer for stitch request images.
    """

    class Meta:

        model = StitchRequestImage

        fields = [
            'id',
            'image',
            'uploaded_at',
        ]

        read_only_fields = [
            'id',
            'uploaded_at',
        ]
        
class StitchRequestSerializer(serializers.ModelSerializer):

    """
    Serializer for stitch request.
    """

    images = StitchRequestImageSerializer(many=True, read_only=True)

    class Meta:

        model = StitchRequest

        fields = [
            'id',
            'customer',
            'tailor',
            'name',
            'description',
            'fabric',
            'color',
            'pattern',
            'design_details',
            'instructions',
            'measurement',
            'reference_design',
            'expected_date',
            'quoted_price',
            'status',
            'submitted_at',
            'updated_at',
            'images',  # Nested images
        ]

        read_only_fields = [
            'id',
            'customer',  # Set from request.user in view
            'submitted_at',
            'updated_at',
        ]

class DesignOrderSerializer(serializers.ModelSerializer):

    """
    Serializer for design order.
    """

    class Meta:

        model = DesignOrder

        fields = [
            'id',
            'customer',
            'tailor',
            'design',
            'quoted_price',
            'status',
            'ordered_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'customer',  # Set from request.user in view
            'ordered_at',
            'updated_at',
        ]
    
class OrderStatusLogSerializer(serializers.ModelSerializer):

    """
    Serializer for order status log.
    """

    changed_by = UserSerializer(read_only=True)

    class Meta:

        model = OrderStatusLog

        fields = [
            'id',
            'stitch_request',
            'from_status',
            'to_status',
            'changed_by',
            'note',
            'changed_at',
        ]

        read_only_fields = [
            'id',
            'stitch_request',  # Set from context in view
            'changed_by',     # Set from request.user in view
            'changed_at',
        ]
        
class GarmentCategorySerializer(serializers.ModelSerializer):

    """
    Serializer for garment category.
    """

    class Meta:

        model = GarmentCategory

        fields = [
            'id',
            'name',
            'department',
            'required_measurements',
        ]

        read_only_fields = [
            'id',
        ]

class CreateStitchRequestSerializer(serializers.ModelSerializer):

    """
    Serializer for creating stitch request.
    """

    name = serializers.CharField(
        max_length=100,
        required=True,
    )
    
    garment_type = serializers.PrimaryKeyRelatedField(
        queryset=GarmentCategory.objects.all(),
    )
    
    fabric = serializers.CharField(
        max_length=100,
        required=True,
    )
    color = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True,
    )
    pattern = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True,
    )
    design_details = serializers.JSONField(
        required=False,
    )
    instructions = serializers.CharField(
        required=False,
        allow_blank=True,
    )
    expected_date = serializers.DateField(
        required=False,
    )
    quoted_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
    )
    
    class Meta:

        model = StitchRequest

        fields = [
            'id',
            'customer',
            'tailor',
            'name',
            'garment_type',
            'fabric',
            'color',
            'pattern',
            'design_details',
            'instructions',
            'measurement',
            'reference_design',
            'expected_date',
            'quoted_price',
        ]
        read_only_fields = [
            'id',
            'customer',  # Set from request.user in view
            'measurement',  # Set from separate endpoint
            'reference_design',  # Set from separate endpoint
        ]
    
    def validate(self, data):
        """
        Custom validation to ensure expected_date is in the future.
        """
        expected_date = data.get('expected_date')
        if expected_date and expected_date < datetime.date.today():
            raise serializers.ValidationError("Expected date must be in the future.")
        return data
    
    def validate_quoted_price(self, value):

        if value is not None and value < 0:

            raise serializers.ValidationError(
                'Quoted price cannot be negative.'
            )

        return value


