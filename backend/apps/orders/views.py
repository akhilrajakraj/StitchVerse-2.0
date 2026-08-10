from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StitchRequest
from .selectors import StitchRequestSelectors
from .serializers import (
    CreateStitchRequestSerializer,
    GarmentCategorySerializer,
    StitchRequestDetailSerializer,
)
from .services import StitchRequestServices


class GarmentCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = StitchRequestServices.list_garment_categories()
        return Response({
            'success': True,
            'categories': GarmentCategorySerializer(categories, many=True).data,
        })


class CreateStitchRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateStitchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        stitch_request = StitchRequestServices.create_stitch_request(
            customer=request.user,
            uploaded_images=request.FILES.getlist('uploaded_images'),
            **serializer.validated_data,
        )
        return Response({
            'success': True,
            'message': 'Stitch request created successfully.',
            'stitch_request_id': stitch_request.id,
        }, status=status.HTTP_201_CREATED)


class CustomerStitchRequestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = StitchRequestSelectors.get_stitch_requests_by_customer(request.user)
        return Response({
            'success': True,
            'stitch_requests': StitchRequestDetailSerializer(requests, many=True).data,
        })


class DetailedStitchRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, stitch_request_id):
        stitch_request = StitchRequestSelectors.get_stitch_request_by_id(stitch_request_id)
        if not stitch_request or stitch_request.customer_id != request.user.id:
            return Response(
                {'success': False, 'message': 'Stitch request not found or access denied.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({
            'success': True,
            'stitch_request': StitchRequestDetailSerializer(stitch_request).data,
        })
