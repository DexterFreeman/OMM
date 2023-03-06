
from django.urls import path
from .views import MeetingView, CreateMeetingView, GetMeeting, JoinMeeting, UserInMeeting, CheckMeetingTime, LeaveMeeting, UpdateView, MeetingViewFI, GetHost, GetDurationTimeInfo, GetMeetingsUserIsIn


#All urls here route from /api as stated in the urls.py file in the OMM folder. 
#These simply route to their respective classes within views.py
urlpatterns = [
    path('', MeetingView.as_view()), 
    path('create-meeting', CreateMeetingView.as_view()), 
    path('get-meeting', GetMeeting.as_view()),
    path('join-meeting', JoinMeeting.as_view()),
    path('user-in-meeting', UserInMeeting.as_view()),
    path('check-meeting-time', CheckMeetingTime.as_view()),
    path('leave-meeting', LeaveMeeting.as_view()),
    path('update-meeting', UpdateView.as_view()), 
    path('FI', MeetingViewFI.as_view()), 
    path('get-host', GetHost.as_view()), 
    path('get-statistics', GetDurationTimeInfo.as_view()),
    path('get-meetings-user', GetMeetingsUserIsIn.as_view()),



] 