from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
import json
from django.http import JsonResponse
from .models import Test, AppUser
from django.http import HttpResponse

import csv



from django.core.management import call_command

from django.contrib.auth.models import User


from django.views.decorators.http import require_POST



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
    


def export_tests_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="tests.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Scheda ID', 'Data', 'Overall', 'Percentuali', 'User ID', 'Nickname'])
    for test in Test.objects.all().select_related('user'):
        writer.writerow([
            test.id,
            test.scheda_id,
            test.data.strftime("%Y-%m-%d %H:%M"),
            test.overall,
            json.dumps(test.percentuali),
            test.user.user_id if test.user else '',
            test.user.nickname if test.user else ''
        ])
    return response



def setup_database(request):
    try:
        # Esegue tutte le migrazioni (crea le tabelle)
        call_command("migrate", interactive=False)
        # Crea il superuser solo se non esiste già
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "", "password123")
            msg = "Migrate OK. Superuser 'admin' creato. Password: password123. CAMBIALA SUBITO!"
        else:
            msg = "Migrate OK. Superuser già esistente."
        return HttpResponse(msg)
    except Exception as e:
        return HttpResponse(f"Errore: {e}")
    

@csrf_exempt
def set_nickname(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        nickname = data.get("nickname")
        if not user_id or not nickname:
            return JsonResponse({"error": "user_id and nickname are required"}, status=400)
        user, created = AppUser.objects.get_or_create(user_id=user_id)
        user.nickname = nickname
        user.save()
        return JsonResponse({"status": "ok", "nickname": nickname})
    return JsonResponse({"error": "Only POST allowed"}, status=405)



@csrf_exempt
@require_POST
def user_sync(request):
    """Crea l'utente se non esiste ancora (chiamato all'avvio del test)."""
    data = json.loads(request.body)
    user_id = data.get("user_id")
    if not user_id:
        return JsonResponse({"error": "user_id mancante"}, status=400)
    
    user, created = AppUser.objects.get_or_create(user_id=user_id)
    return JsonResponse({
        "status": "ok",
        "created": created,
        "nickname": user.nickname or ""
    })


@csrf_exempt
@require_POST
def user_nickname(request):
    """Associa un nickname al user_id."""
    data = json.loads(request.body)
    user_id = data.get("user_id")
    nickname = data.get("nickname", "").strip()

    if not user_id or not nickname:
        return JsonResponse({"error": "user_id o nickname mancante"}, status=400)

    try:
        user = AppUser.objects.get(user_id=user_id)
    except AppUser.DoesNotExist:
        user = AppUser.objects.create(user_id=user_id)

    user.nickname = nickname
    user.save()
    return JsonResponse({"status": "ok", "nickname": user.nickname})