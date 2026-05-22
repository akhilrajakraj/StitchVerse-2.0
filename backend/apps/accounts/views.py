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
