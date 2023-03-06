from rest_framework import serializers 
from .models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Meeting
        fields = ('id', 'code', 'host', 'auto_join', 'start_time', 'duration_time', 'created_at', 
                'topic_of_meeting', 'join_link', 'zoom_meeting_id', 'password_of_meeting', 'calendar_id' )


class CreateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Meeting
        fields = ('auto_join', 'start_time', 'duration_time', 'topic_of_meeting',)




class UpdateMeetingSerializer(serializers.ModelSerializer):
    #Allows a code to be passed in that isn't unique as the code in the serializer referances this instead of the properties in the model
    code =serializers.CharField(validators=[])

    class Meta:
        model=Meeting
        fields = ('auto_join', 'start_time', 'duration_time', 'topic_of_meeting', 'code', 'zoom_meeting_id')
