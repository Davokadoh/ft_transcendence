# serializers.py

from rest_framework import serializers
from .models import Player_data

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player_data
        fields = '__all__'
