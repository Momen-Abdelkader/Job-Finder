from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def profile(request):
    return HttpResponse("Hello, world. You're at the base profile.")


def jobs(request):
    return HttpResponse("Hello, world. You're at the base jobs.")

def adminDashboard(request):
    return HttpResponse("Hello, world. You're at the base adminDashboard.")
