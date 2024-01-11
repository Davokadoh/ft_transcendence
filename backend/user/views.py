from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from .backend import CustomAuthenticationBackend
from django.views.decorators.csrf import csrf_exempt

class login(View):
    @csrf_exempt
    async def get(self, request):
        return render(request, "login.html")

    @csrf_exempt
    async def post(self, request):
        return CustomAuthenticationBackend.authenticate(request)

class callback(View):
    @csrf_exempt
    async def get(self, request):
        return CustomAuthenticationBackend.callback(request)
