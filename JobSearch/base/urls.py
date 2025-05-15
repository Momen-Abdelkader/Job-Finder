from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('jobs/', views.jobs, name='jobs'),
    path('admin-dashboard/', views.adminDashboard, name='adminDashboard'),
    path('login/', views.loginView, name='login'),
    path('signup/', views.signupView, name='signup'),
    path('logout/', views.logoutUser, name='logout'),
    path('forgot-password/', views.resetPassword, name='resetPassword'),
    path('accounts/', include('allauth.urls')),

]