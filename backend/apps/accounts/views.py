from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import rest_framework

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterCustomerSerializer,
    CustomProfileSerializer,
    CustomerMeasurementSerializer,
    AddCustomerMeasurementSerializer,
)

from .services import(
    AccountService,

)

from .permissions import(
    IsCustomer,
)

from .selectors import(
    AccountSelectors,
)
class CustomTokenObtainPairView(TokenObtainPairView):
    
    serializer_class = CustomTokenObtainPairSerializer

class RegisterCustomerAPIView(APIView):
    
    """
    API For customer register.
    """
    
    permission_classes = []
    
    def post(self, request):
        
        serializer = RegisterCustomerSerializer(
            data = request.data
        )
        
        serializer.is_valid(
            raise_exception=True
        )
        
        customer = AccountService.register_customer(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            full_name=serializer.validated_data['full_name'],
            phone=serializer.validated_data['phone'],
            address_data=serializer.validated_data['address'],
        )
        
        response_serializer = CustomProfileSerializer(
            customer
        )
        
        return Response(
            {
                'success':True,
                'message': 'Customer Registered Successfully.',
                'data':response_serializer.data,
            },
            status = status.HTTP_201_CREATED
        )

class CustomerProfileAPIView(APIView):
    
    """
    API for customer profile.
    """
    
    permission_classes = [IsCustomer]
    
    def get(self, request):
        
        customer_profile = AccountSelectors.get_customer_profile(
            user=request.user
        )
        
        serializer = CustomProfileSerializer(
            customer_profile
        )
        
        return Response(
            {
                'success':True,
                'data':serializer.data,
            },
            status=status.HTTP_200_OK
        )
    
    def put(self, request):
        
        profile = AccountSelectors.get_customer_profile(
            user=request.user
        )
        
        if not profile:
            
            return Response(
                {
                    'success':False,
                    'message':'Customer Profile not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CustomProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )
        
        serializer.is_valid(
            raise_exception=True
        )
        
        serializer.save()
        
        return Response(
            {
                'success':True,
                'message':'Profile updated successfully.',
                'data':serializer.data,
            },
            status=status.HTTP_200_OK
        )



class CreateMeasurementAPIView(APIView):
    
    """
    API for creating measurements.
    """
    permission_classes=[IsCustomer]
    
    def post(self, request):
        
        serializer = AddCustomerMeasurementSerializer(
            data=request.data
        )
        
        serializer.is_valid(raise_exception=True)
        
        measurement = AccountService.create_measurement(
            customer=request.user,
            validated_data=serializer.validated_data,
        )
        
        response_serializer = CustomerMeasurementSerializer(
            measurement
        )
        
        return Response(
            {
                'success':True,
                'message':'Measurement Created Successfully.',
                'data':response_serializer.data,
            },
            status=status.HTTP_201_CREATED
        )
        
class ViewCustomerMeasurementsAPIView(APIView):
    
    """
    API for viewing customer measurements.
    """
    permission_classes=[IsCustomer]
    
    def get(self, request):
        
        measurements = AccountSelectors.get_user_measurements(
            user=request.user
        )
        
        serializer = CustomerMeasurementSerializer(
            measurements,
            many=True
        )
        
        return Response(
            {
                'success':True,
                'data':serializer.data,
            },
            status=status.HTTP_200_OK
        )
