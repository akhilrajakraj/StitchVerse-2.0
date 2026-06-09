from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    CreateStitchRequestSerializer,
    GarmentCategorySerializer,
    StitchRequestDetailSerializer,
)
from .services import (
    StitchRequestServices,
)

from .selectors import (
    StitchRequestSelectors,
)

class GarmentCategoryListAPIView(APIView):

    """
    API to list all garment categories.
    """

    def get(self, request):

        categories = StitchRequestServices.list_garment_categories()

        serializer = GarmentCategorySerializer(
            categories,
            many=True
        )

        return Response(
            {
                'success': True,
                'categories': serializer.data,
            },
            status=status.HTTP_200_OK
        )

class CreateStitchRequestAPIView(APIView):
    
    """
    API for customers to create stitch requests.
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        serializer = CreateStitchRequestSerializer(
            data=request.data
        )
        
        if not serializer.is_valid():
            print("Validation Failed", serializer.errors)
        
        serializer.is_valid(
            raise_exception=True
        )
        
        stitch_request = StitchRequestServices.create_stitch_request(
            customer=request.user,
            tailor=serializer.validated_data.get('tailor'),
            name=serializer.validated_data['name'],
            garment_type=serializer.validated_data['garment_type'],
            fabric=serializer.validated_data['fabric'],
            color=serializer.validated_data['color'],
            pattern=serializer.validated_data['pattern'],
            design_details=serializer.validated_data.get('design_details', ''),
            instructions=serializer.validated_data.get('instructions', ''),
            measurement=serializer.validated_data.get('measurement'),
            reference_design=serializer.validated_data.get('reference_design'),
            expected_date=serializer.validated_data.get('expected_date'),
            uploaded_images=request.FILES.getlist('uploaded_images')
        )
        
        return Response(
            {
                'success': True,
                'message': 'Stitch request created successfully.',
                'stitch_request_id': stitch_request.id,
            },
            status=status.HTTP_201_CREATED
        )

class CustomerStitchRequestDetailAPIView(APIView):
    
    """
    API for customers to view details of their stitch requests.
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        stitch_request = StitchRequestSelectors.get_stitch_requests_by_customer(
            customer=request.user
        )
        
        if not stitch_request:
            return Response(
                {
                    'success': False,
                    'message': 'Stitch request not found or access denied.',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = StitchRequestDetailSerializer(
            stitch_request,
            many=True,
            context={'request': request}
        )
        
        return Response(
            {
                'success': True,
                'stitch_requests': serializer.data,
            },
            status=status.HTTP_200_OK
        )
        
class DetailedStitchRequestAPIView(APIView):
    
    """
    API for customers to view details of a specific stitch request.
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, stitch_request_id):
        
        stitch_request = StitchRequestSelectors.get_stitch_request_by_id(
            stitch_request_id=stitch_request_id
        )
        
        if not stitch_request or stitch_request.customer != request.user:
            return Response(
                {
                    'success': False,
                    'message': 'Stitch request not found or access denied.',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = StitchRequestDetailSerializer(
            stitch_request,
            context={'request': request}
        )
        
        return Response(
            {
                'success': True,
                'stitch_request': serializer.data,
            },
            status=status.HTTP_200_OK
        )
    