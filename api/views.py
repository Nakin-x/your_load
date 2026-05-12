from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.core.management import call_command
from django.contrib.auth.models import User
import json
import csv

from .models import Test, AppUser


@csrf_exempt
def salva_test(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        user = AppUser.objects.filter(user_id=user_id).first() if user_id else None

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

    return JsonResponse({"error": "Only POST allowed"}, status=405)


def lista_test(request):
    scheda_id = request.GET.get("scheda_id")
    tests = Test.objects.all().order_by("-data")
    if scheda_id:
        tests = tests.filter(scheda_id=scheda_id)
    return JsonResponse(list(tests.values()), safe=False)


@csrf_exempt
@require_POST
def sync_user(request):
    """Crea l'utente se non esiste, restituisce il nickname se già salvato."""
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
def set_nickname(request):
    """Associa un nickname al user_id."""
    data = json.loads(request.body)
    user_id = data.get("user_id")
    nickname = data.get("nickname", "").strip()

    if not user_id or not nickname:
        return JsonResponse({"error": "user_id o nickname mancante"}, status=400)

    user, _ = AppUser.objects.get_or_create(user_id=user_id)
    user.nickname = nickname
    user.save()
    return JsonResponse({"status": "ok", "nickname": user.nickname})


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
        call_command("migrate", interactive=False)
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "", "password123")
            msg = "Migrate OK. Superuser 'admin' creato. Password: password123. CAMBIALA SUBITO!"
        else:
            msg = "Migrate OK. Superuser già esistente."
        return HttpResponse(msg)
    except Exception as e:
        return HttpResponse(f"Errore: {e}")