from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    CreateDesignSerializer,
)

from .services import (
    DesignServices,
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
        
        
    
    