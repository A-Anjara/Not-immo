from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

MONTH = "Janvier,Fevrier,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre".split(",")

def path_to(instance,filename):
    return f"bien/{instance.type_de_bien.label}/{filename}"


# Create your models here.
class Fonction(models.Model):
    label = models.CharField(max_length=50,null=False)
    description = models.TextField(null=False)

    def __str__(self):
        return self.label
    
    def serialize(self):
        return {'id':self.id,'label':self.label,'description':self.description}

class TypeBien(models.Model):
    label =models.CharField(max_length=75,null=False)

    def __str__(self):
        return self.label
    
    def serialize(self):
        return {'id':self.id,'label':self.label}

class Notaire(models.Model):
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    fonction = models.ForeignKey(Fonction,on_delete=models.PROTECT)
    telephone = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    adresse = models.CharField(max_length=100)

    def __str__(self):
        return self.nom +" " +self.prenom
    
    def serialize(self):
        return {'id':self.id,'nom':self.nom,'prenom':self.prenom,'fonction':self.fonction.serialize(),'telephone':self.telephone,'email':self.email,'adresse':self.adresse}

class Bien(models.Model):
    titre = models.CharField(max_length=75,null=False)
    type_de_bien = models.ForeignKey(TypeBien,on_delete=models.PROTECT,null=False)
    chambre = models.SmallIntegerField(null=False)
    salle_de_bain = models.SmallIntegerField(null=False)
    surface = models.SmallIntegerField(null=False)
    prix = models.IntegerField(null=False)
    localisation = models.CharField(max_length=75,null=False)
    description = models.TextField(null=False)
    atout = models.TextField(null=False)
    notaire = models.ForeignKey(Notaire,on_delete=models.PROTECT,null = False)
    type_de_vente = models.CharField(max_length=15,choices={"Acheter":"Acheter","Louer":"Louer"})
    image_1 = models.ImageField(upload_to=path_to,null=False)
    image_2 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_3 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_4 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_5 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_6 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_7 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_8 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_9 = models.ImageField(upload_to=path_to,null=True,blank=True)
    image_10 = models.ImageField(upload_to=path_to,null=True,blank=True)
    
    
    def get_images(self):
        images = [self.image_1]
        if(self.image_2):
            images.append(self.image_2)
        if(self.image_3):
            images.append(self.image_3)
        if(self.image_4):
            images.append(self.image_4)
        if(self.image_5):
            images.append(self.image_5)
        if(self.image_6):
            images.append(self.image_6)
        if(self.image_7):
            images.append(self.image_7)
        if(self.image_8):
            images.append(self.image_8)
        if(self.image_9):
            images.append(self.image_9)
        if(self.image_10):
            images.append(self.image_10)
        return images



    def __str__(self):
        return self.titre
    
    def serialize(self):
        
        images = self.get_images()
        images_url = []
        for image in images:
            images_url.append(image.url)
        return {'id':self.id,'titre':self.titre,'images':images_url,'type_de_bien':self.type_de_bien.serialize(),'chambre':self.chambre,
                'salle_de_bain':self.salle_de_bain,'surface':self.surface,'prix':self.prix,
                'localisation':self.localisation,'description':self.description,'atout':self.atout,
                'notaire':self.notaire.serialize(),'type_de_vente':self.type_de_vente
                }





def path_article_to(instance,filename):
    return f"article/{instance.categorie.label}/{filename}"

class TypeArticle(models.Model):
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label
    

class Article(models.Model):
    titre = models.CharField(max_length=200,null=False)
    description = models.TextField(null=False)
    text = models.TextField(null=False)
    date = models.DateTimeField(auto_now_add=True)
    liste = models.TextField(null=True)
    categorie = models.ForeignKey(TypeArticle,on_delete=models.PROTECT)
    image = models.ImageField(upload_to=path_article_to,null=False)
    


    def __str__(self):
        return self.titre
    
    def upload_date(self):
        return f"{self.date.day} {MONTH[self.date.month -1]} {self.date.year}"
    
    
        
    


@receiver(post_delete,sender=Article)
def delete_article(sender,instance,**kwargs):
    os.remove(instance.image.path)

@receiver(post_delete,sender=Bien)
def delete_article(sender,instance,**kwargs):
    images = instance.get_images()
    for image in images:
        os.remove(image.path)