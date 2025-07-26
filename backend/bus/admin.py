from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .models import *

app = apps.get_app_config('bus')
for model in app.get_models():
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass