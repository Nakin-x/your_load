from django.contrib import admin
from .models import Test, AppUser

# Registrazione semplice, senza import-export
admin.site.register(Test)
admin.site.register(AppUser)