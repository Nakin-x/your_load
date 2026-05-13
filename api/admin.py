from django.contrib import admin
from .models import Test, AppUser
from import_export.admin import ExportMixin
from import_export import resources, fields

class TestResource(resources.ModelResource):
    nickname = fields.Field()
    
    def dehydrate_nickname(self, test):
        if test.user and test.user.nickname:
            return test.user.nickname
        elif test.user:
            return test.user.user_id
        return '-'

    class Meta:
        model = Test
        fields = ['id', 'scheda_id', 'data', 'overall', 'nickname', 
                  'valutazioni', 'conteggi', 'percentuali', 'totale_workload']
        export_order = ['id', 'nickname', 'scheda_id', 'data', 'overall',
                        'totale_workload', 'valutazioni', 'conteggi', 'percentuali']

@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ['nickname', 'user_id', 'created_at']
    search_fields = ['nickname', 'user_id']

@admin.register(Test)
class TestAdmin(ExportMixin, admin.ModelAdmin):
    resource_classes = [TestResource]
    list_display = ['id', 'get_nickname', 'scheda_id', 'data', 'overall']
    search_fields = ['user__nickname', 'user__user_id', 'scheda_id']

    def get_nickname(self, obj):
        if obj.user and obj.user.nickname:
            return obj.user.nickname
        elif obj.user:
            return obj.user.user_id
        return '-'
    get_nickname.short_description = 'Utente'