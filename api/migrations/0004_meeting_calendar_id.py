# Generated by Django 4.0.1 on 2022-03-10 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_meeting_password_of_meeting_alter_meeting_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='calendar_id',
            field=models.CharField(default='', max_length=30),
        ),
    ]
