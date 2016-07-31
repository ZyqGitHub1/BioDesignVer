# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-31 07:57
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projectManage', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sequence', models.CharField(max_length=255, null=True)),
                ('name', models.CharField(max_length=64)),
                ('isModified', models.BooleanField(default=True)),
                ('image_file_path', models.CharField(max_length=255, null=True)),
            ],
            options={
                'db_table': 'bio_chain',
            },
        ),
        migrations.AlterField(
            model_name='project',
            name='function',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='projectManage.Functions'),
        ),
        migrations.AlterField(
            model_name='project',
            name='track',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='projectManage.Tracks'),
        ),
        migrations.AddField(
            model_name='chain',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projectManage.Project'),
        ),
    ]