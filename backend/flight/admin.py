from django.contrib import admin
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered

app = apps.get_app_config('flight')

for model in app.get_models():
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass