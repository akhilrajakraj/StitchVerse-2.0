from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TailorProfile
from .serializers import (
    RegisterTailorSerializer,
    TailorProfileSerializer,
    TailorListSerializer,
)
from .selectors import TailorSelectors
from .services import TailorRegService
from .workflows import TailorApprovalService


class RegisterTailorAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterTailorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        tailor = TailorRegService.register_tailor(
            email=data['email'],
            password=data['password'],
            full_name=data['full_name'],
            phone=data['phone'],
            address_data=data['address'],
            specialisation=data['specialisation'],
            qualification=data['qualification'],
            bio=data.get('bio', ''),
        )
        return Response(
            {'success': True, 'message': 'Tailor registered successfully.',
             'data': TailorProfileSerializer(tailor).data},
            status=status.HTTP_201_CREATED,
        )


class TailorProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = TailorSelectors.get_tailor_profile(request.user)
        if not profile:
            return Response({'success': False, 'message': 'Tailor profile not found.'}, status=404)
        return Response({'success': True, 'data': TailorProfileSerializer(profile).data})

    def put(self, request):
        profile = TailorSelectors.get_tailor_profile(request.user)
        if not profile:
            return Response({'success': False, 'message': 'Tailor profile not found.'}, status=404)
        serializer = TailorProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'message': 'Profile updated successfully.', 'data': serializer.data})

    patch = put


class TailorListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tailors = TailorSelectors.get_all_tailors(
            user=request.user,
            search=request.query_params.get('search'),
            specialisation=request.query_params.get('specialisation'),
            qualification=request.query_params.get('qualification'),
        )
        return Response({'success': True, 'data': TailorListSerializer(tailors, many=True).data})


class TailorApprovalAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, profile_id):
        profile = TailorProfile.objects.select_related('user').filter(pk=profile_id).first()
        if not profile:
            return Response({'success': False, 'message': 'Tailor profile not found.'}, status=404)

        action = request.data.get('action')
        if action == 'approve':
            profile = TailorApprovalService.approve(profile)
        elif action == 'reject':
            profile = TailorApprovalService.reject(profile)
        elif action == 'remove':
            profile = TailorApprovalService.remove(profile)
        else:
            return Response({'success': False, 'message': 'action must be approve, reject, or remove.'}, status=400)

        return Response({'success': True, 'data': TailorProfileSerializer(profile).data})
