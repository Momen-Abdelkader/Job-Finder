from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('jobs/', views.jobs, name='jobs'),
    path('admin-dashboard/', views.adminDashboard, name='adminDashboard'),
    path('login/', views.loginView, name='login'),
    path('signup/', views.signupView, name='signup'),
    path('logout/', views.logoutUser, name='logout'),
    path(
        'forgot-password/', 
         auth_views.PasswordResetView.as_view(template_name='forgot-password.html'), 
         name='forgot_password'),
    path('forgot-password-sent/', 
         auth_views.PasswordResetDoneView.as_view(template_name='forgot-password-sent.html'), 
         name='password_reset_done'),
    path('forgot/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(template_name='forgot-password-confirm.html'), 
         name='password_reset_confirm'),
    path('forgot-password-complete/', 
         auth_views.PasswordResetCompleteView.as_view(template_name='forgot-password-complete.html'), 
         name='password_reset_complete'),
    path('accounts/', include('allauth.urls')),
    path('api/job/<int:job_id>/apply/', views.apply_for_job_api, name='apply_for_job_api'),
    path('api/job/<int:job_id>/details/', views.get_job_details_api, name='get_job_details_api'),
]