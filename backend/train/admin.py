from django.contrib import admin
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered
from django import forms
from .models import Route, RouteEdge

app = apps.get_app_config('train')
for model in app.get_models():
    if model == Route:
        continue
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass

class RouteAdminForm(forms.ModelForm):
    edge_identifiers = forms.ModelMultipleChoiceField(
        queryset=RouteEdge.objects.all(),
        required=False,
        widget=forms.SelectMultiple(attrs={'size': 10})
    )

    class Meta:
        model = Route
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.edge_identifiers:
            self.fields['edge_identifiers'].initial = RouteEdge.objects.filter(
                pk__in=self.instance.edge_identifiers
            )

    def clean_edge_identifiers(self):
        edges = self.cleaned_data.get('edge_identifiers')
        return [e.pk for e in edges]

    def save(self, commit=True):
        route = super().save(commit=False)
        route.edge_identifiers = self.cleaned_data['edge_identifiers']
        if commit:
            route.save()
        return route


class RouteAdmin(admin.ModelAdmin):
    form = RouteAdminForm

admin.site.register(Route, RouteAdmin)