# Generated by Django 4.0.1 on 2022-03-06 16:47

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_ending_time_meeting_duration_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='password_of_meeting',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AlterField(
            model_name='meeting',
            name='code',
            field=models.CharField(default=api.models.generate_unique_code, max_length=8, unique=True),
        ),
    ]
