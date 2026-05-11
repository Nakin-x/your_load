from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class AppUser(models.Model):
     user_id = models.CharField(max_length=100, unique=True)
     created_at = models.DateTimeField(auto_now_add=True)
     nickname = models.CharField(max_length=100, blank=True, null=True)
     
class Test(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True, blank=True)

    scheda_id = models.CharField(max_length=50)
    data = models.DateTimeField(auto_now_add=True)

    valutazioni = models.JSONField()      # 6 valori
    conteggi = models.JSONField()         # pesi finali

    percentuali = models.JSONField()      # distribuzione %
    totale_workload = models.FloatField()
    overall = models.FloatField()



