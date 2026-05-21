from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (
    CreateDesignSerializer,
    DesignCategorySerializer,
    DesignSerializer,
)

from .models import (
    Design,
    DesignCategory,
)

from .services import (
    DesignServices,
)

from .selectors import(
    DesignSelectors,
)
class CreateDesignAPIView(APIView):
    
    """
    API for tailor uploading design.
    """
    def post(self, request):
        
        serializer = CreateDesignSerializer(
            data = request.data
        )
        
        serializer.is_valid(
            raise_exception=True
        )
        
        design = DesignServices.create_design(
            tailor=request.user,
            category=serializer.validated_data['category'],
            name=serializer.validated_data['name'],
            description=serializer.validated_data['description'],
            price=serializer.validated_data['price']
        )
        
        return Response(
            {
                'success':True,
                'message': 'Design Uploaded Successfully.',
                'design_id': design.id,
            },
            status=status.HTTP_201_CREATED
        )
        
class DesignCategoryListAPIView(APIView):
    """
    API endpoint for public retrieval of the dynamic design categories taxonomy tree.
    """
    permission_classes = [AllowAny] # 🔓 No authentication required for reading categories

    def get(self, request):
        # Fetch root categories (categories without a parent) to handle nested trees,
        # or grab all categories directly. Let's pull all seeded entries:
        categories = DesignCategory.objects.all()
        
        # Serialize database entries into standard clean JSON formats
        serializer = DesignCategorySerializer(categories, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class TailorDesignListAPIView(APIView):
    
    """
    API Endpoint for retreiving respective tailors portfolio.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        designs = DesignSelectors.get_tailor_designs(
            tailor=request.user
        )
        
        serializer = DesignSerializer(
            designs,
            many=True
        )
        
        return Response(
            {
                'success':True,
                'data':serializer.data
            },
            status=status.HTTP_200_OK
        )
        
class TailorDesignDetailAPIView(APIView):
    
    """
    API endpoint of retreiving specific design details.
    """
    def delete(self, request, design_id):
        
        design = DesignSelectors.get_design_by_id(
            design_id
        )
        
        if not design or design.tailor != request.user:
            
            return Response(
                {
                    'detail':'Design not found or unauthorized'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        DesignServices.delete_design(design)
        
        return Response(
            {
                'success':True,
                'message':'Design deleted successfully.'
            }
        )
    
    
    
    