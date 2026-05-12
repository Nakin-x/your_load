from django.urls import path
from .views import salva_test, lista_test, sync_user, set_nickname, export_tests_csv, setup_database

urlpatterns = [
    path("test/", salva_test),
    path("user/sync/", sync_user, name="user_sync"),
    path("user/nickname/", set_nickname, name="set_nickname"),
    path("debug/", lista_test),
    path("export-csv/", export_tests_csv, name="export_tests_csv"),
    path("setup/", setup_database, name="setup"),
]