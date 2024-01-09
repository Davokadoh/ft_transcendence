from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from .backend import CustomAuthenticationBackend

class login(View):
    async def get(self, request):
        return render(request, "login.html")

    async def post(self, request):
        return CustomAuthenticationBackend.authenticate(request)

class callback(View):
    async def get(self, request):
        return CustomAuthenticationBackend.callback(request)
