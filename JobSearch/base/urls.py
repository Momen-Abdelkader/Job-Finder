from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('jobs/', views.jobs, name='jobs'),
    path('admin-dashboard/<str:pk>', views.adminDashboard, name='adminDashboard'),
    # path('admin-dashboard/', views.adminDashboard, name='adminDashboard'),
    path('login/', views.loginView, name='login'),
    path('signup/', views.signupView, name='signup'),
    path('logout/', views.logoutUser, name='logout'),
    path('forgot-password/', auth_views.PasswordResetView.as_view(), name='forgot_password'),
    path('forgot-password-sent/', auth_views.PasswordChangeDoneView.as_view(), name='password_reset_done'),
    path('forgot/<uid64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('forgot-password-complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('accounts/', include('allauth.urls')),

]