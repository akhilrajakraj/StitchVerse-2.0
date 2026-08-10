from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Design, DesignCategory
from .selectors import DesignSelectors
from .serializers import (
    CreateDesignSerializer,
    DesignCategorySerializer,
    DesignSerializer,
)
from .services import DesignServices


class DesignListAPIView(APIView):
    """Public marketplace listing with lightweight filtering."""
    permission_classes = [AllowAny]

    def get(self, request):
        designs = DesignSelectors.get_active_designs(
            search=request.query_params.get('search'),
            category=request.query_params.get('category'),
            tailor=request.query_params.get('tailor'),
            min_price=request.query_params.get('min_price'),
            max_price=request.query_params.get('max_price'),
        )
        return Response(
            {'success': True, 'data': DesignSerializer(designs, many=True).data},
            status=status.HTTP_200_OK,
        )


class DesignDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, design_id):
        design = DesignSelectors.get_design_by_id(design_id, active_only=True)
        if not design:
            return Response({'detail': 'Design not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {'success': True, 'data': DesignSerializer(design).data},
            status=status.HTTP_200_OK,
        )


class CreateDesignAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateDesignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        design = DesignServices.create_design(
            tailor=request.user,
            **serializer.validated_data,
        )
        images = request.FILES.getlist('images')
        if images:
            DesignServices.upload_design_images(design, images)
        return Response(
            {'success': True, 'message': 'Design uploaded successfully.', 'design_id': design.id},
            status=status.HTTP_201_CREATED,
        )


class DesignCategoryListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = DesignCategory.objects.all().order_by('name')
        return Response(DesignCategorySerializer(categories, many=True).data)


class TailorDesignListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        designs = DesignSelectors.get_tailor_designs(request.user)
        return Response({'success': True, 'data': DesignSerializer(designs, many=True).data})


class TailorDesignDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, design_id):
        design = DesignSelectors.get_design_by_id(design_id)
        if not design:
            return Response({'detail': 'Design not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'data': DesignSerializer(design).data})

    def patch(self, request, design_id):
        design = Design.objects.filter(id=design_id, tailor=request.user).first()
        if not design:
            return Response({'detail': 'Design not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CreateDesignSerializer(design, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        design = DesignServices.update_design(design, **serializer.validated_data)
        return Response({'success': True, 'data': DesignSerializer(design).data})

    def delete(self, request, design_id):
        design = Design.objects.filter(id=design_id, tailor=request.user).first()
        if not design:
            return Response({'detail': 'Design not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
        DesignServices.delete_design(design)
        return Response({'success': True, 'message': 'Design deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
