from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("scheda/<str:scheda_id>/", views.scheda, name="scheda"),
    path("scheda/<str:scheda_id>/test/", views.test, name="test"),
    path(
        "scheda/<str:scheda_id>/risultato/<int:test_index>/",
        views.risultato,
        name="risultato"
    ),
]
