from rest_framework import serializers

from .models import (
    Design,
    DesignCategory,
    DesignImage,
    DesignTag,
    DesignTagMap,
    DesignOrderStatus,
)

from apps.accounts.serializers import (
    UserSerializer,
)

class DesignCategorySerializer(serializers.ModelSerializer):
    
    """
    Serialzer for Design category.
    """
    class Meta:
        
        model = DesignCategory
        
        fields = [
            'id',
            'name',
            'slug',
            'parent',
        ]
        
        read_only_fields = [
            'id',
        ]

class DesignSerializer(serializers.ModelSerializer):
    
    """
    Serializer for Tailors design.
    """
    tailor = UserSerializer(read_only=True)
    category = DesignCategorySerializer()
    
    class Meta:
        
        model = Design
        
        fields = [
            'id',
            'tailor',
            'category',
            'name',
            'description',
            'price',
            'is_active',
            'created_at',
            'updated_at',
        ]
        
        read_only_fields = [
            'id',
            'tailor',
            'created_at',
            'updated_at',
        ]

class DesignImageSerializer(serializers.ModelSerializer):
    
    """
    Serializers for Design Image.
    """
    
    design = DesignSerializer()
    
    class Meta:
        
        model = DesignImage
        
        fields = [
            'id',
            'design',
            'image',
            'is_primary',
            'order',
            'uploaded_at',
        ]
        
        read_only_fields = [
            'id',
            'uploaded_at',
        ]

class DesignTagSerializer(serializers.ModelSerializer):
    
    """
    Serializer for Design Tag.
    """
    class Meta:
        
        model = DesignTag
        
        fields = [
            'id',
            'name',
            'slug',
        ]
        
        read_only_fields=[
            'id',
        ]

class DesignTagMapSerializer(serializers.ModelSerializer):
    
    """
    Serializer for Design Tag Map.
    """
    design = DesignSerializer()
    tag = DesignTagSerializer()

    class Meta:
        
        model = DesignTagMap
        
        fields = [
            'design',
            'tag',
        ]
        read_only_fields =[
            'design',
            'tag',
        ]
    
class CreateDesignSerializer(serializers.ModelSerializer):
    
    """
    Serializer for creating design.
    """
    
    name = serializers.CharField(
        max_length=255,
        required=True,
    )

    description = serializers.CharField(
        required=True,
        allow_blank=False,
    )

    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    class Meta:
        
        model = Design
        
        fields = [
            'category',
            'name',
            'description',
            'price',
        ]
    
    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Category is required.")
        return value
    
    def validate_name(self, value):
        if value is None:
            raise serializers.ValidationError("Name is required.")
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return value
    
    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError("Price is required.")
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value
    
    def validate_description(self, value):
        if value is None:
            raise serializers.ValidationError("Description is required.")
        if len(value) < 10:
            raise serializers.ValidationError("Description should not be short.")
        return value

