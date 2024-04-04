from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    steam_id = models.TextField()
    avatar_url = models.TextField()
    steam_tradelink = models.TextField(blank=True)
    is_admin = models.BooleanField(default=False)
    password = None

    class Meta:
        db_table = 'Users'


class Wallet(models.Model):
    wallet_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    class Meta:
        db_table = 'Wallets'
    