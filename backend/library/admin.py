from django.contrib import admin
from .models import Collection, CollectionItem, ReadingHistory

admin.site.register(Collection)
admin.site.register(CollectionItem)
admin.site.register(ReadingHistory)
