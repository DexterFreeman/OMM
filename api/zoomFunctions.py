import jwt
import requests
import json
from time import time
import datetime

API_KEY = 'Ltws8N47Q9SKACIp5jXwIQ'
API_SEC = 'aq5M9flwGHOWbzueWzDVN4E2Ri6u2H4XtNtn'


#Method to set mins to hour & mins
def convert(min):
    hour, min = divmod(min, 60)
    return (hour, min)


#Checks if the current time is within the meeting time. Takes in string start time, converts it to datetime. 
def IsItTime(startTime, duration):
    duration= int(duration)
    startTime = startTime.split(',')
    L = list(startTime)
    startTimeDT = datetime.datetime(int(L[0]), int(L[1]), int(L[2]), int(L[3]), int(L[4]), 0).strftime("%Y-%m-%dT%H:%M:%SZ")
    now = datetime.datetime.now()
    start = (int(L[0]), int(L[1]), int(L[2]), int(L[3]), int(L[4]))
    timeString = convertDurationTime(start, duration)
    timeString = timeString.split(',')
    L2 = list(timeString)
    current_time = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    convertedDateTime = datetime.datetime(int(L2[0]),int(L2[1]), int(L2[2]),int(L2[3]),int(L2[4]), 0).strftime("%Y-%m-%dT%H:%M:%SZ")
    #If the time is between the start time and end time then return true
    if (startTimeDT < current_time):
        if (convertedDateTime > current_time):
            return True
    #Else return false.             
    return False




#Adds the duration time to the startTime to be used on later in the request
def convertDurationTime(startTime, durationTime): 

    mins = durationTime
    durationHour = convert(mins)[0]
    durationMins = convert(mins)[1]

    startTime_List = list(startTime)

    if (startTime_List[4] + durationMins) > 60: 
        total = (startTime_List[4] + durationMins)
        extraHour = convert(total)[0]
        extraMins = convert(total)[1]
        durationHour = durationHour+extraHour
        durationMins = extraMins
        startTime_List[3] = (startTime_List[3] + durationHour)
        startTime_List[4] = durationMins
    else: 
        startTime_List[3] = (startTime_List[3] + durationHour)
        startTime_List[4] = (startTime_List[4] + durationMins)
        if startTime_List[4] == 60: 
            startTime_List[3] = (startTime_List[3] + 1)
            startTime_List[4] = 1

    str1 = ','.join(str(e) for e in startTime_List)
    str1 = str1 + ",00"
    return (str1)


def generateToken():
	token = jwt.encode(

		# Create a payload of the token containing
		# API Key & expiration time
		{'iss': API_KEY, 'exp': time() + 5000},

		# Secret used to generate token signature
		API_SEC,

		# Specify the hashing alg
		algorithm='HS256'
	)
	return token


#Delete the meeting
def DeleteMeeting(meeting_id):
	url = 'https://api.zoom.us/v2/meetings/'+str(meeting_id)
	header = {'authorization': 'Bearer ' + generateToken()}
	zoom_delete_meeting = requests.delete(url, headers=header)
	#print(zoom_delete_meeting)
	return zoom_delete_meeting


#This is to update the meeting, simple patch request
def UpdateMeeting(start_time, duration, topic, meeting_id): 
    
    meetingdetails = {
	    "start_time": start_time,
	    "duration": duration,
	    "topic": topic
    }
    url = 'https://api.zoom.us/v2/meetings/'+str(meeting_id)
    header = {'authorization': 'Bearer '+ generateToken()}
    get_zoom_meeting = requests.patch(url,json=meetingdetails, headers=header)
    return(get_zoom_meeting)


# send a request with headers including
# a token and meeting details

def createMeeting(startTime, durationTime, topicOfMeeting):
    durationTime = int(durationTime)
    startTime = startTime.split(',')
    L = list(startTime)
    start = datetime.datetime(int(L[0]), int(L[1]), int(L[2]), int(L[3]), int(L[4]), 0).strftime("%Y-%m-%dT%H:%M:%SZ")
	# create json data for post requests
    meetingdetails = {"topic": topicOfMeeting,
				"type": 2,
				"start_time": start,
				"duration": durationTime,
				"timezone": "Europe/London",
				"agenda": "test",
				"recurrence": {"type": 1,
								"repeat_interval": 1
								},
				"settings": {"host_video": "true",
							"participant_video": "true",
							"join_before_host": "False",
							"mute_upon_entry": "False",
							"watermark": "true",
							"audio": "voip",
							"auto_recording": "cloud"
							}
				}
    headers = {'authorization': 'Bearer ' + generateToken(),
			'content-type': 'application/json'}
    r = requests.post(
		f'https://api.zoom.us/v2/users/me/meetings',
		headers=headers, data=json.dumps(meetingdetails))
    #print("\n creating zoom meeting ... \n")
	#print(r.text)
	# converting the output into json and extracting the details
    y = json.loads(r.text)
    join_URL = y["join_url"]
    meetingPassword = y["password"]
    #print(
		#f'\n here is your zoom meeting link {join_URL} and your \
		#password: "{meetingPassword}"\n')

    return y
