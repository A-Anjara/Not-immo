from django.urls import path,include
from .views import *

app_name="main_app"
urlpatterns =[
    path('',acheter,name="acheter"),
    path('louer/',louer,name="louer"),
    path('partenaire/',partenaire,name="partenaire"),
    path('contact/',contact,name="contact"),
    path('conseil/',conseil,name="conseil"),
    path('envoyer/',envoyer,name="envoyer")
]
