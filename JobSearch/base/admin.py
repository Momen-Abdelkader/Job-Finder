from django.contrib import admin

from .models import User, Job, UserSkill, UserInterest, RequiredSkill, AdminProfile, UserProfile

# Register your models here.

admin.site.register(User)

admin.site.register(AdminProfile)

admin.site.register(UserProfile)

admin.site.register(Job)

admin.site.register(UserSkill)

admin.site.register(UserInterest)

admin.site.register(RequiredSkill)