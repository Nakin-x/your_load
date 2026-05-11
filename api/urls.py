from django.urls import path
from .views import salva_test, lista_test, sync_user, export_tests_csv, setup_database, set_nickname

urlpatterns = [
    path("test/", salva_test),
    path("user/sync/", sync_user),
    path("debug",lista_test),
    path("export-csv/", export_tests_csv, name="export_tests_csv"),
    path("setup/", setup_database, name="setup"),
    path("user/nickname/", set_nickname, name="set_nickname"),

]