from django.contrib import admin
from .models import Test, AppUser
from import_export.admin import ExportMixin

@admin.register(Test)
class YourModelAdmin(ExportMixin, admin.ModelAdmin):
    pass