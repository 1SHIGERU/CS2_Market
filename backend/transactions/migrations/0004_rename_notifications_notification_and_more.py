# Generated by Django 5.0.3 on 2024-04-16 08:26

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0003_notifications'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Notifications',
            new_name='Notification',
        ),
        migrations.RenameModel(
            old_name='Ratings',
            new_name='Rating',
        ),
    ]