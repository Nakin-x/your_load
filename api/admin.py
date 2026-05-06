from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from .models import Test, AppUser

@admin.register(Test)
class TestAdmin(ImportExportModelAdmin):
    list_display = ('id', 'scheda_id', 'data', 'overall')
    list_filter = ('scheda_id',)

@admin.register(AppUser)
class AppUserAdmin(ImportExportModelAdmin):
    list_display = ('user_id', 'created_at')