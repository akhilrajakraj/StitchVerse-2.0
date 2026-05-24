from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import rest_framework
from rest_framework.permissions import IsAuthenticated


from .serializers import(
    RegisterTailorSerializer,
    TailorProfileSerializer,
    TailorListSerializer,
)

from .services import (
    TailorRegService,
)

from .selectors import(
    TailorSelectors,
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
        
        profile = TailorSelectors.get_tailor_profile(
            user=request.user
        )
        
        if not profile:
            
            return Response(
                {
                    'success': False,
                    'message':'Tailor Profile not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = TailorProfileSerializer(
            profile
        )
        
        return Response(
            {
                'success': True,
                'data': serializer.data,
            },
            status=status.HTTP_200_OK
        )
    
    def put(self, request):
        
        profile = TailorSelectors.get_tailor_profile(
            user=request.user
        )
        
        if not profile:
            
            return Response(
                {
                    'success':False,
                    'message':'Tailor Profile not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = TailorProfileSerializer(
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
                'message':'Profile Updated Successfully.',
                'data':serializer.data,
            },
            status=status.HTTP_200_OK
        )

class TailorListAPIView(APIView):
    
    """
    API for listing all active tailors.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        tailors = TailorSelectors.get_all_tailors(
            user=request.user
        )
        
        serializer = TailorListSerializer(
            tailors,
            many=True
        )
        
        return Response(
            {
                'success':True,
                'data':serializer.data,
            },
            status=status.HTTP_200_OK
        )