
from django.urls import path
from .views import index
urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index),
    path('meeting/<str:meetingCode>', index),
    path('view', index),
    path('statistics', index),
]
