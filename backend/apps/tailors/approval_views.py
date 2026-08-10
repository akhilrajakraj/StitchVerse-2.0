from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .approval_serializers import TailorApprovalSerializer
from .models import TailorProfile
from .workflows import TailorApprovalService


class TailorApprovalAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, tailor_id):
        try:
            profile = TailorProfile.objects.select_related("user").get(pk=tailor_id)
        except TailorProfile.DoesNotExist:
            return Response(
                {"success": False, "message": "Tailor profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TailorApprovalSerializer(
            data=request.data,
            context={"profile": profile},
        )
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        if action == "approve":
            profile = TailorApprovalService.approve(profile)
        elif action == "reject":
            profile = TailorApprovalService.reject(profile)
        else:
            profile = TailorApprovalService.remove(profile)

        return Response(
            {
                "success": True,
                "message": f"Tailor {action}d successfully.",
                "data": {
                    "id": str(profile.id),
                    "approval_status": profile.approval_status,
                },
            },
            status=status.HTTP_200_OK,
        )
