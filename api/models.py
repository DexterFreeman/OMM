from django.db import models
import random
import string

# Generates the meeting codes
def generate_unique_code():
    length = 8
    while True: 
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Meeting.objects.filter(code=code).count() == 0: 
            break
    return code


# Meeting model
class Meeting(models.Model):
    code =  models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, default="")
    auto_join = models.BooleanField(null=False, default=False)
    start_time = models.CharField(max_length=30)
    duration_time = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    topic_of_meeting = models.CharField(max_length=20, default="")
    join_link = models.CharField(max_length=20, default="")
    zoom_meeting_id = models.IntegerField(null=False, default=0)
    password_of_meeting = models.CharField(max_length=15, default="")
    calendar_id = models.CharField(max_length=30, default="")