from asyncio import events
from calendar import calendar
from pprint import pprint
from tkinter import Y
from urllib import response 
from .Google import Create_Service, convert_to_RFC_datetime
import os
import json
CLIENT_SECRET_FILE = (r"C:\Users\Dex\Documents\FINAL\client_secret_file.json")
API_NAME = 'calendar'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/calendar']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
calendar_id_current = 'r7g6qlp4v35unf13vmisrqfsc8@group.calendar.google.com'



def convert(min):
    hour, min = divmod(min, 60)
    return (hour, min)



def convertDurationTime(startTime, durationTime): 

    mins = durationTime
    #Converts the duration time from minutes to hours + minutes
    mins = int(mins)
    durationHour = convert(mins)[0]
    durationMins = convert(mins)[1]

    startTimeList = list(startTime)
    #If the duration is longer than an hour:
    if (startTimeList[4] + durationMins) > 60: 
        total = (startTimeList[4] + durationMins)
        extraHour = convert(total)[0]
        extraMins = convert(total)[1]
        durationHour = durationHour+extraHour
        durationMins = extraMins
        startTimeList[3] = (startTimeList[3] + durationHour)
        startTimeList[4] = (durationMins)
    else: 
        startTimeList[3] = (startTimeList[3] + durationHour)
        startTimeList[4] = (startTimeList[4] + durationMins)

    str1 = ','.join(str(e) for e in startTimeList)
    str1 = str1 + ",00"
    return (str1)




def DeleteEvent(calEventID):
    service.events().delete(calendarId=calendar_id_current, eventId=calEventID).execute()


#Create an event: 

def createEvent(startTime, duration, topic, details):

    #Does datetime converstions as the needed format of the data for the date and time of the event is different to zooms and needs to be changed
    startTime = startTime.split(',')
    #Have to convert it to a last as the convert_to_RFC_datetime doesn't accept tuples
    L = list(startTime)
    start = (int(L[0]), int(L[1]), int(L[2]), int(L[3]), int(L[4]))
    timeString = convertDurationTime(start, duration)
    timeString = timeString.split(',')
    L2 = list(timeString)
 

    #Contains the information about the event I am creating. 
    event_request_body = {
        'start': {
            'dateTime': convert_to_RFC_datetime(int(L[0]), int(L[1]), int(L[2]), int(L[3]), int(L[4])),
            'timeZone': 'Europe/London'
        },
        'end': {
            'dateTime': convert_to_RFC_datetime(int(L2[0]), int(L2[1]), int(L2[2]), int(L2[3]), int(L2[4])),
            'timeZone': 'Europe/London'
        },
        'summary': topic,
        'description': details,
        'status': 'confirmed',
        'transparency': 'opaque',
        'visability': 'private', 
        'location': 'Online',
        'attendees': [
            {
            'displayName': 'Dexter',
                'comment': 'This was scheduled using OMM!',
                'optional': False, 
                'email': 'dexy.freeman@yahoo.co.uk',
                'organizer': True, 
                'responseStatus': 'accepted'
            }
        ],
    }
    sendNotifcation = True 
    sendUpdate = 'none'
    supportAttachments = True 
    #CalendarID sets this event to an event calendar as well as the user's calendar. 
    response = service.events().insert(
        calendarId=calendar_id_current,
        sendNotifications=sendNotifcation,
        sendUpdates=sendUpdate,
        supportsAttachments=supportAttachments,
        body=event_request_body
    ).execute()
    print(type(response))
    return (response)



