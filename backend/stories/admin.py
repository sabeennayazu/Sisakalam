from django.contrib import admin
from .models import Story, Genre, Tags

admin.site.register(Story)
admin.site.register(Genre)
admin.site.register(Tags)
