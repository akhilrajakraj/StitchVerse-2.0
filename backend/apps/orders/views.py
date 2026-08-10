from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OrderStatus
from .selectors import StitchRequestSelectors
from .serializers import (
    CreateStitchRequestSerializer,
    GarmentCategorySerializer,
    StitchRequestDetailSerializer,
    StitchRequestImageSerializer,
)
from .services import StitchRequestServices


class GarmentCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = StitchRequestServices.list_garment_categories()
        return Response({'success': True, 'categories': GarmentCategorySerializer(categories, many=True).data})


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
        return Response(
            {'success': True, 'message': 'Stitch request created successfully.', 'stitch_request_id': stitch_request.id},
            status=status.HTTP_201_CREATED,
        )


class CustomerStitchRequestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = StitchRequestSelectors.get_stitch_requests_by_customer(request.user)
        return Response({'success': True, 'stitch_requests': StitchRequestDetailSerializer(requests, many=True).data})


class DetailedStitchRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, stitch_request_id):
        stitch_request = StitchRequestSelectors.get_stitch_request_by_id(stitch_request_id, customer=request.user)
        if not stitch_request:
            return Response({'success': False, 'message': 'Stitch request not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'stitch_request': StitchRequestDetailSerializer(stitch_request).data})


class TailorStitchRequestListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = StitchRequestSelectors.get_stitch_requests_by_tailor(
            request.user,
            status=request.query_params.get('status'),
        )
        return Response({'success': True, 'stitch_requests': StitchRequestDetailSerializer(requests, many=True).data})


class TailorStitchRequestActionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    ACTIONS = {
        'accept': (OrderStatus.ACCEPTED, 'Request accepted by tailor.'),
        'reject': (OrderStatus.CANCELLED, 'Request rejected by tailor.'),
        'start_stitching': (OrderStatus.STITCHING, 'Tailor started stitching.'),
        'quality_check': (OrderStatus.QUALITY_CHECK, 'Request submitted for quality check.'),
        'ready': (OrderStatus.READY_FOR_DELIVERY, 'Request marked ready for delivery.'),
    }

    def post(self, request, stitch_request_id):
        stitch_request = StitchRequestSelectors.get_stitch_request_by_id(stitch_request_id, tailor=request.user)
        if not stitch_request:
            return Response({'success': False, 'message': 'Stitch request not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        transition = self.ACTIONS.get(action)
        if not transition:
            return Response({'success': False, 'message': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        target, default_note = transition
        try:
            updated = StitchRequestServices.transition(
                stitch_request,
                target,
                actor=request.user,
                note=request.data.get('note') or default_note,
            )
        except ValueError as exc:
            return Response({'success': False, 'message': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True, 'status': updated.status})


class StitchRequestImageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, stitch_request_id):
        stitch_request = StitchRequestSelectors.get_stitch_request_by_id(stitch_request_id, customer=request.user)
        if not stitch_request:
            stitch_request = StitchRequestSelectors.get_stitch_request_by_id(stitch_request_id, tailor=request.user)
        if not stitch_request:
            return Response({'success': False, 'message': 'Stitch request not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'images': StitchRequestImageSerializer(stitch_request.images.all(), many=True).data})
