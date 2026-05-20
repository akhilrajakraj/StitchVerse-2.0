from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import rest_framework
from rest_framework.permissions import IsAuthenticated


from .serializers import(
    RegisterTailorSerializer,
    TailorProfileSerializer,
)

from .services import (
    TailorRegService,
)

class RegisterTailorAPIView(APIView):
    
    """
    API for Tailor Register.
    """
    permission_classes = []
    
    def post(self, request):
        
        serializer = RegisterTailorSerializer(
            data = request.data
        )
        
        serializer.is_valid(
            raise_exception=True
        )
        
        validated_data = serializer.validated_data
        
        tailor = TailorRegService.register_tailor(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            full_name=serializer.validated_data['full_name'],
            phone=serializer.validated_data['phone'],
            address_data=serializer.validated_data['address'],
            specialisation=validated_data['specialisation'],
            qualification=validated_data['qualification'],
            bio=validated_data.get('bio', ''),
        )
        
        response_serializer = TailorProfileSerializer(
            tailor
        )
        
        return Response(
            {
                'success':True,
                'message': 'Tailor Registered Successfully.',
                'data':response_serializer.data,
            },
            status = status.HTTP_201_CREATED
        )

class TailorProfileAPIView(APIView):
    
    """
    API for Tailor Profile Retrieval and Update.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tailor = request.user
        serializer = TailorProfileSerializer(tailor)
        return Response(
            {
                'success': True,
                'data': serializer.data,
            },
            status=status.HTTP_200_OK
        )
    