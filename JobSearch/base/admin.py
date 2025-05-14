from django.contrib import admin

from .models import User, Job, UserSkill, Interest, Skill, AdminProfile, UserProfile, JobApplication

# Register your models here.

admin.site.register(User)

admin.site.register(AdminProfile)

admin.site.register(UserProfile)

admin.site.register(Job)

admin.site.register(UserSkill)

admin.site.register(Interest)

admin.site.register(Skill)

admin.site.register(JobApplication)