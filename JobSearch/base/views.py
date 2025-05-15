from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import User, UserProfile, AdminProfile

def home(request):
    return render(request, 'home.html')

def profile(request):
    return HttpResponse("Hello, world. You're at the base profile.")

def jobs(request):
    return HttpResponse("Hello, world. You're at the base jobs.")

def adminDashboard(request):
    return HttpResponse("Hello, world. You're at the base adminDashboard.")

def loginView(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                login(request, authenticated_user)
                messages.success(request, "Login successful!")
                if authenticated_user.is_admin:
                    return redirect('adminDashboard')
                return redirect('home')
            else:
                messages.error(request, "Invalid email or password.")
        except User.DoesNotExist:
            messages.error(request, "Invalid email or password.")
        
        return redirect('login')
    
    return render(request, 'login.html')

def signupView(request):
    if request.method == 'POST':
        username = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        user_type = request.POST.get('user_type', 'normal')
        
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect('signup')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('signup')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect('signup')
        
        if user_type == 'company' and not request.POST.get('company_name'):
            messages.error(request, "Company name is required for company accounts.")
            return redirect('signup')
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_admin=(user_type == 'company')
            )
            
            if user_type == 'normal':
                UserProfile.objects.create(user=user)
            else:
                company_name = request.POST.get('company_name')
                AdminProfile.objects.create(user=user, company_name=company_name)
            
            messages.success(request, "Account created successfully!")
            return redirect('login') # TODO: redirect to home
        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return redirect('signup')
    
    print("Rendering signup page")
    return render(request, 'signup.html')

def resetPassword(request):
    return render(request, 'forgot-password.html')

def logoutUser(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')