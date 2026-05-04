from django.urls import path
from .views import salva_test, lista_test, sync_user

urlpatterns = [
    path("test/", salva_test),
    path("user/sync/", sync_user),
    path("debug",lista_test)
]