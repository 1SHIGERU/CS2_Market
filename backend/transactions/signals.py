from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Transaction, Notification

@receiver(pre_save, sender=Transaction)
def update_closed_date(sender, instance, **kwargs):
    if instance.is_closed and not instance.closed_date:
        instance.closed_date = timezone.now()

@receiver(post_save, sender=Transaction)
def handle_transaction_save(sender, instance, created, **kwargs):
    if created and instance.offer.is_active:
        instance.offer.is_active = False
        instance.offer.save()

        item = instance.offer.item
        message = (f"Twój przedmiot {item.item_name} "
                   f"{'w ilości: ' + str(instance.offer.quantity) if not item.condition else item.condition} został sprzedany! "
                   f"Dostarcz przedmiot pod wskazany adres: {instance.buyer.steam_tradelink}, "
                   f"a następnie potwierdź wysyłkę w panelu.")
        
        Notification.objects.create(
            transaction=instance,
            message=message,
            active=True
        )

@receiver(post_delete, sender=Transaction)
def handle_transaction_delete(sender, instance, **kwargs):
    if instance.offer:
        instance.offer.is_active = True
        instance.offer.save()