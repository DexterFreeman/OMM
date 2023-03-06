from ast import Delete
from cgitb import lookup
from email.policy import HTTP
from ntpath import join
from pstats import Stats
from django.http import JsonResponse
from django.shortcuts import render
from httplib2 import Response
from rest_framework import generics, status
from .serializers import MeetingSerializer, CreateMeetingSerializer, UpdateMeetingSerializer
from .models import Meeting
from rest_framework.views import APIView
from rest_framework.response import Response
from .zoomFunctions import createMeeting, IsItTime, DeleteMeeting, UpdateMeeting
from .googleCalendarFunctions import createEvent, DeleteEvent
from django.http import JsonResponse
import webbrowser
from django.views import generic


#Lists all of the current objects within the database
class MeetingView(generics.ListAPIView): 
    queryset = Meeting.objects.all() 
    serializer_class = MeetingSerializer


class MeetingViewFI(generic.ListView):
    model = Meeting


#Gets all of the meetings that the user is the host of. 
class GetHost(APIView):
    serializer_class = MeetingSerializer
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        host = self.request.session.session_key
        #Filters meetings by session key
        meeting = Meeting.objects.filter(host=host)
        return Response(MeetingSerializer(meeting).data,status=status.HTTP_200_OK)
        

#Creates a new meeting
class CreateMeetingView(APIView):
    serializer_class = CreateMeetingSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        #If the data is valid
        if serializer.is_valid(): 
            #Load the serialized data
            auto_join = serializer.data.get('auto_join')
            start_time = serializer.data.get('start_time')
            duration_time = serializer.data.get('duration_time')
            topic_of_meeting = serializer.data.get('topic_of_meeting')
            host = self.request.session.session_key
            queryset = Meeting.objects.filter(start_time=start_time)
            #If the user is the creates a meeting that already has a startime. 
            if queryset.exists(): 
                #Creates the online meeting in zoom then stores the JSON response created by doing so
                meeting_details = createMeeting(start_time, duration_time, topic_of_meeting)
                #Update the data using the data from the response of zoom
                zoom_meeting_id = (meeting_details["id"])
                password_of_meeting = (meeting_details["password"])
                join_link = (meeting_details["join_url"])
                meeting_zoom_details = (join_link, 'password:',password_of_meeting)
                #Create a google calendar event containing the details collected from the online meeting
                create_event_response = createEvent(start_time, duration_time, topic_of_meeting, meeting_zoom_details )
                #Store the rest of the information ito the database
                meeting = queryset[0]
                meeting.calendar_id = create_event_response["id"]
                meeting.auto_join = auto_join
                meeting.start_time = start_time
                meeting.duration_time = duration_time
                meeting.topic_of_meeting = topic_of_meeting
                meeting.join_link = join_link
                meeting.zoom_meeting_id = zoom_meeting_id
                meeting.password_of_meeting = password_of_meeting
                #Update the sessions room code for the frontend
                self.request.session['meeting_code'] = meeting.code
                meeting.save(update_fields=['auto_join', 'start_time', 'duration_time', 'topic_of_meeting', 'join_link', 'zoom_meeting_id', 'password_of_meeting'])
                return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
            #If not, create the new room
            else: 
                meeting_details = createMeeting(start_time, duration_time, topic_of_meeting)
                zoom_meeting_id = (meeting_details["id"])
                password_of_meeting = (meeting_details["password"])
                join_link = (meeting_details["join_url"])
                meeting_zoom_details = (join_link, 'password:',password_of_meeting)
                print("HOST", host)
                create_event_response = createEvent(start_time, duration_time, topic_of_meeting, meeting_zoom_details )
                calendar_id = create_event_response["id"]
                meeting = Meeting(host=host, auto_join=auto_join, start_time=start_time, duration_time=duration_time, topic_of_meeting=topic_of_meeting, join_link=join_link, zoom_meeting_id=zoom_meeting_id, password_of_meeting=password_of_meeting, calendar_id=calendar_id) 
                meeting.save() 
                self.request.session['meeting_code'] = meeting.code
                #Returns json formatted data to return to the frontend
                return Response(MeetingSerializer(meeting).data,status=status.HTTP_201_CREATED)

        #Return bad request when data isn't valid
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


#Joins a meeting 
class JoinMeeting(APIView):
    lookup_url_code = 'code'
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_code)
        #If there is a code in the request
        if code != None:
            meeting_result = Meeting.objects.filter(code=code)
            #If there is a meeting with that code
            if len(meeting_result) > 0: 
                meeting = meeting_result[0]
                #If the user requesting isn't the host of this meeting
                if meeting.host != self.request.session.session_key:
                    return Response({'Error': 'You are not the creator of this meeting'}, status=status.HTTP_403_FORBIDDEN)
                #Add the meeting the user is in to the session
                self.request.session['meeting_code'] = code
                return Response({'Message': 'Joined'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Meeting code not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request', 'Invalid post data, no code'}, stats=status.HTTP_400_BAD_REQUEST)


#Gets the statistics 
class GetDurationTimeInfo(APIView):
    serializer_class = MeetingSerializer
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        hostID = self.request.session.session_key
        #Gets all the meetings the user is the host of
        meeting = Meeting.objects.filter(host=hostID)
        current_duration_time = 0
        #If the user is host to no meetings
        if len(meeting) == 0: 
            #Return nothing
            return Response((0, 0 ,0), status=status.HTTP_200_OK)
        #Calculating the statistics
        for i in range(len(meeting)): 
            current_duration_time = current_duration_time + int(meeting[i].duration_time)
        number_of_meetings = len(meeting)
        average_time_of_meeting = current_duration_time / number_of_meetings
        average_time_of_meeting = round(average_time_of_meeting, 2)
        data = (current_duration_time, number_of_meetings, average_time_of_meeting)
        #Returns them
        return Response(data, status=status.HTTP_200_OK)


#Gets the codes + names of meetings the user is in
class GetMeetingsUserIsIn(APIView): 
    serializer_class = MeetingSerializer
    def get(self, request, format=None): 
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        hostID = self.request.session.session_key
        meeting = Meeting.objects.filter(host=hostID)
        meeting_codes = ""
        meeting_topics = ""
        meeting_start_times = ""
        if len(meeting) == 0: 
            return Response(0, status=status.HTTP_200_OK)
        for i in range(len(meeting)): 
            meeting_codes = meeting_codes + (meeting[i].code) + ","
            meeting_topics = meeting_topics + (meeting[i].topic_of_meeting) + ","
            data = (meeting_codes, meeting_topics)
        return Response(data, status=status.HTTP_200_OK)

#Gets the meeting information from a specified meeting code
class GetMeeting(APIView): 
    serializer_class = MeetingSerializer
    lookup_url_code = 'code'
    def get(self,request,format=None):
        code = request.GET.get(self.lookup_url_code)
        if code != None: 
            #Looks for the room with the meeting code
            meeting = Meeting.objects.filter(code=code)
            if len(meeting) > 0:
                #If the specific room is found, serialize the data
                data = MeetingSerializer(meeting[0]).data
                data['is_host'] = self.request.session.session_key == meeting[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad request:' 'Invalid Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request', 'No code parameter in request'}, status=status.HTTP_400_BAD_REQUEST)


#Uses a meeting code to check if that meeting is occuring in the current time
class CheckMeetingTime(APIView):   
    serializer_class = MeetingSerializer
    lookup_url_code = 'code'
    def get(self,request,format=None):
        code = request.GET.get(self.lookup_url_code)
        if code != None:
            meeting = Meeting.objects.filter(code=code)
            if len(meeting) > 0:
                data = MeetingSerializer(meeting[0]).data
                if (IsItTime(meeting[0].start_time, meeting[0].duration_time) == True):
                    data['is_time'] = True
                    webbrowser.open(meeting[0].join_link)
                    return Response(data, status=status.HTTP_200_OK)
                else: 
                    data['is_time'] = False
                    return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad request:' 'Invalid Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request', 'No code parameter in request'}, status=status.HTTP_400_BAD_REQUEST)


#Simply pulls the code from the session and converts it to a usable variable. 
class UserInMeeting(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('meeting_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


#Deleted the meeting, used to be simply used for leaving a meeting but I repurposed the function
class LeaveMeeting(APIView): 
    def post(self, request, format=None):
        #Uses the session to get the meeting code
        meeting_results = Meeting.objects.filter(code=self.request.session['meeting_code'])

        if meeting_results.exists(): 
            meeting = meeting_results[0]
            meetingID = meeting.zoom_meeting_id
            #Deletes the meetings calendar event and online meeting
            DeleteMeeting(meeting_id = meetingID)
            DeleteEvent(meeting.calendar_id)
            #Pops the meeting code out of the session
            self.request.session.pop('meeting_code')
            #Deletes the meeting from the database
            Meeting.objects.filter(id=meeting.id).delete()
            return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
        return Response({'Error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        

#Updates a meetingh
class UpdateView(APIView):
    serializer_class = UpdateMeetingSerializer
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            start_time = serializer.data.get('start_time')
            auto_join = serializer.data.get('auto_join')
            duration_time = serializer.data.get('duration_time')
            topic_of_meeting = serializer.data.get('topic_of_meeting')
            code = serializer.data.get('code')
            #Checks to see if the meeting it's trying to update exists
            queryset = Meeting.objects.filter(code=code)
            if not queryset.exists():
                return Response({'Message': 'Meeting code not found'}, status=status.HTTP_404_NOT_FOUND) 
            meeting = queryset[0]
            user_id = self.request.session.session_key
            #Checks the meeting host made this request 
            if meeting.host != user_id: 
                return (Response({'Message': "You don't have permission"}, status=status.HTTP_403_FORBIDDEN))
            meeting.start_time = start_time
            meeting.auto_join = auto_join
            meeting.duration_time = duration_time
            meeting.topic_of_meeting = topic_of_meeting
            meeting_zoom_details = (meeting.join_link, 'password:',meeting.password_of_meeting)
            #Updates the respetive meetings
            #Deleted the calendar event and creates a new one instead of update
            #As updating an event needs the entire reponse from the intial creation and I don't store that.
            UpdateMeeting(start_time, duration_time, topic_of_meeting, meeting.zoom_meeting_id)
            DeleteEvent(meeting.calendar_id)
            create_event_response = createEvent(start_time, duration_time, topic_of_meeting, meeting_zoom_details)
            meeting.calendar_id = create_event_response["id"]
            #Updates the meeting in the database
            meeting.save(update_fields=['start_time', 'auto_join', 'duration_time', 'topic_of_meeting', 'calendar_id'])
            #Returns the new meeting
            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        return Response({'Bad request': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)