import json
from django.shortcuts import render,redirect,reverse
from django.conf import settings
from .models import *
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
# Create your views here.


def acheter(request):
    biens = []
    for bien in Bien.objects.filter(type_de_vente = "Acheter"):
        biens.append(bien.serialize())
    biens = json.dumps(biens)

    return render(request,'main_app/acheter.html',{'biens':biens,'type_de_bien':TypeBien.objects.all(),'acheter':'acheter'})

def louer(request):
    biens = []
    for bien in Bien.objects.filter(type_de_vente = "Louer"):
        biens.append(bien.serialize())
    biens = json.dumps(biens)

    return render(request,'main_app/louer.html',{'biens':biens,'type_de_bien':TypeBien.objects.all(),'louer':'louer'})


def partenaire(request):
    partenaire = Notaire.objects.all()
    for x in partenaire:
        print(x)
    return render(request,'main_app/partenaire.html',{'partenaires':partenaire,'fonctions':Fonction.objects.all()})

def contact(request):
    return render(request,'main_app/contact.html')

def conseil(request):
    return render(request,'main_app/conseil.html',{'articles':Article.objects.order_by('-date'),'type_articles':TypeArticle.objects.all()})

def envoyer(request):
    if request.method == 'POST':
	    send_mail(
	    	request.POST['sujet'],
	    	f"{request.POST['nom']} {request.POST['prenom']}\n{request.POST['email']}\n{request.POST['telephone']}\n\n{request.POST['message']}",
	    	"admin@notimmo.mg",
	    	["millemost@gmail.com"],
	    	fail_silently = False
	    )
    return redirect(reverse('main_app:contact'))


