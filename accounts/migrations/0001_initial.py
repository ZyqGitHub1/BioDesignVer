# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-10-21 17:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(db_index=True, max_length=64, unique=True, verbose_name='token')),
                ('lastTime', models.DateTimeField(auto_now=True)),
                ('expire', models.BigIntegerField(verbose_name='expire')),
            ],
            options={
                'db_table': 'bio_usersafety',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('userName', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('isConfirmed', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'bio_user',
            },
        ),
        migrations.AddField(
            model_name='token',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='accounts.User'),
        ),
    ]
