from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import CustomUser
from apps.orders.models import StitchRequest
from apps.tailors.models import TailorProfile

from .models import QualityCheckResult
from .services import StaffService


class StaffTailorApprovalAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        profile = TailorProfile.objects.select_related('user').filter(id=profile_id).first()
        if not profile:
            return Response({'success': False, 'message': 'Tailor profile not found.'}, status=404)
        action = request.data.get('action')
        if action == 'approve':
            StaffService.approve_tailor(admin=request.user, profile=profile)
        elif action == 'reject':
            StaffService.ensure_staff(request.user)
            profile.approval_status = 'rejected'
            profile.user.is_verified = False
            profile.user.save(update_fields=['is_verified', 'updated_at'])
            profile.save(update_fields=['approval_status', 'updated_at'])
        else:
            return Response({'success': False, 'message': 'Invalid action.'}, status=400)
        return Response({'success': True, 'status': profile.approval_status})


class StaffUserStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user = CustomUser.objects.filter(id=user_id).first()
        if not user:
            return Response({'success': False, 'message': 'User not found.'}, status=404)
        updated = StaffService.set_user_status(
            admin=request.user,
            user=user,
            status_value=request.data.get('status'),
            notes=request.data.get('notes', ''),
        )
        return Response({'success': True, 'status': updated.status})


class StaffQualityCheckAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, stitch_request_id):
        stitch_request = StitchRequest.objects.filter(id=stitch_request_id).first()
        if not stitch_request:
            return Response({'success': False, 'message': 'Stitch request not found.'}, status=404)
        result = request.data.get('result')
        if result not in QualityCheckResult.values:
            return Response({'success': False, 'message': 'Invalid quality-check result.'}, status=400)
        check = StaffService.complete_quality_check(
            inspector=request.user,
            stitch_request=stitch_request,
            result=result,
            notes=request.data.get('notes', ''),
        )
        return Response({'success': True, 'quality_check_id': str(check.id), 'result': check.result})
