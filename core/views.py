from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def home(request):
    return render(request, "core/home.html")

def scheda(request, scheda_id):
    return render(request, "core/scheda.html", {"scheda_id": scheda_id})

def test(request, scheda_id):
    return render(request, "core/test.html", {"scheda_id": scheda_id})


def risultato(request, scheda_id, test_index):
    return render(
        request,
        "core/risultato.html",
        {
            "scheda_id": scheda_id,
            "test_index": test_index
        }
    )


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("/")

    return render(request, "core/login.html")



# views.py


def privacy_policy(request):
    return render(request, "core/privacy_policy.html")