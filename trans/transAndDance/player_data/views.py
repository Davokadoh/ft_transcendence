# views.py

from rest_framework import viewsets
from .models import Player_data
from .serializers import TaskSerializer
from django.http import HttpResponse

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Player_data.objects.all()
    serializer_class = TaskSerializer

def test(request, nickname):
    return HttpResponse("Nickname: %s" % Player_data.objects.get(nickname__icontains=nickname))