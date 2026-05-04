from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
import json
from django.http import JsonResponse
from .models import Test, AppUser
from django.http import HttpResponse
@csrf_exempt
def salva_test(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user_id = data.get("user_id")

        user = None
        if user_id:
            user = AppUser.objects.filter(user_id=user_id).first()

        test = Test.objects.create(
            user=user,
            scheda_id=data.get("scheda_id"),
            valutazioni=data.get("valutazioni"),
            conteggi=data.get("conteggi"),
            percentuali=data.get("percentuali"),
            totale_workload=data.get("totaleWorkload"),
            overall=data.get("overall"),
        )

        return JsonResponse({"id": test.id})

    return JsonResponse({"error": "Only POST allowed"})




def lista_test(request):
    scheda_id = request.GET.get("scheda_id")

    tests = Test.objects.all().order_by("-data")

    if scheda_id:
        tests = tests.filter(scheda_id=scheda_id)

    data = list(tests.values())

    return JsonResponse(data, safe=False)



@csrf_exempt
def sync_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")

        user, created = AppUser.objects.get_or_create(user_id=user_id)

        return JsonResponse({
            "user_id": user.user_id,
            "created": created
        })