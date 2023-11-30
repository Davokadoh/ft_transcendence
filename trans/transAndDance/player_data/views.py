from django.http import HttpResponse
from django.template import loader
from .models import Player_data

def player_data(request):
  myplayers = Player_data.objects.all().values()
  template = loader.get_template('all_player.html')
  context = {
    'myplayers': myplayers
  }
  return HttpResponse(template.render(context, request))