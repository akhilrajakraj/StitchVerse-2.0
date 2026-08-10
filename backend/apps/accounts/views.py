from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsCustomer
from .selectors import AccountSelectors
from .serializers import (
    AddCustomerMeasurementSerializer,
    CustomProfileSerializer,
    CustomerMeasurementSerializer,
    CustomTokenObtainPairSerializer,
    RegisterCustomerSerializer,
)
from .services import AccountService


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterCustomerAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterCustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = AccountService.register_customer(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            full_name=serializer.validated_data["full_name"],
            phone=serializer.validated_data["phone"],
            address_data=serializer.validated_data["address"],
        )

        return Response(
            {
                "success": True,
                "message": "Customer registered successfully.",
                "data": CustomProfileSerializer(customer).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerProfileAPIView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        profile = AccountSelectors.get_customer_profile(request.user)
        if profile is None:
            return Response(
                {"success": False, "message": "Customer profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"success": True, "data": CustomProfileSerializer(profile).data},
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        profile = AccountSelectors.get_customer_profile(request.user)
        if profile is None:
            return Response(
                {"success": False, "message": "Customer profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CustomProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Profile updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    put = patch


class CreateMeasurementAPIView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request):
        serializer = AddCustomerMeasurementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        measurement = AccountService.create_measurement(
            customer=request.user,
            validated_data=serializer.validated_data,
        )

        return Response(
            {
                "success": True,
                "message": "Measurement created successfully.",
                "data": CustomerMeasurementSerializer(measurement).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ViewCustomerMeasurementsAPIView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        measurements = AccountSelectors.get_user_measurements(request.user)
        return Response(
            {
                "success": True,
                "data": CustomerMeasurementSerializer(measurements, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class UpdateMeasurementAPIView(APIView):
    permission_classes = [IsCustomer]

    def put(self, request, measurement_id):
        measurement = AccountSelectors.get_measurement_by_id(
            measurement_id=measurement_id,
            customer=request.user,
        )
        if measurement is None:
            return Response(
                {"success": False, "message": "Measurement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AddCustomerMeasurementSerializer(
            measurement,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        updated_measurement = AccountService.update_measurement(
            measurement=measurement,
            updated_data=serializer.validated_data,
        )

        return Response(
            {
                "success": True,
                "message": "Measurement updated successfully.",
                "data": CustomerMeasurementSerializer(updated_measurement).data,
            },
            status=status.HTTP_200_OK,
        )

    patch = put


class DeleteMeasurementAPIView(APIView):
    permission_classes = [IsCustomer]

    def delete(self, request, measurement_id):
        measurement = AccountSelectors.get_measurement_by_id(
            measurement_id=measurement_id,
            customer=request.user,
        )
        if measurement is None:
            return Response(
                {"success": False, "message": "Measurement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        AccountService.remove_measurement(measurement)
        return Response(status=status.HTTP_204_NO_CONTENT)
