from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

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
