from django.apps import apps
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin 
from django.contrib.admin.sites import AlreadyRegistered
from .models import *

class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (('Additional Info', {'fields': ('phone_number',)}),)

admin.site.register(UserProfile, UserProfileAdmin)

app = apps.get_app_config('bus')

for model in app.get_models():
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass