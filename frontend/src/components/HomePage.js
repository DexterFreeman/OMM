import React, {Component} from "react";
import CreateMeetingPage from "./CreateMeetingPage";
import MeetingJoinPage from "./MeetingJoinPage";
import Meeting from "./Meeting";
import ViewStatistics from "./ViewStatistics";
import ViewMeetings from "./ViewMeetings";
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"
import { Grid, Button, ButtonGroup, Typography, AppBar, Toolbar, Container, CssBaseline} from "@material-ui/core"
import { MeetingRoomSharp } from "@material-ui/icons"

//This is the parent component
export default class HomePage extends Component{
    constructor(props){
        super(props); 

        this.state = {
            meetingCode: null, 
            AutoJoin: false, 
            test: false, 
            
        };
        this.clearMeetingCode = this.clearMeetingCode.bind(this);
        this.openZoomMeeting = this.openZoomMeeting.bind(this);
            
        

    }

    
  
    //Updates meeting code when it's deleted
    clearMeetingCode(){ 
        this.setState({
            meetingCode: null,
        })
    }

    //Gets the room code of a meeting the user is in if it's start time is right now. 
    async componentDidMount() {
        fetch("/api/user-in-meeting")
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                meetingCode: data.code,
            });
            console.log(this.state)
            this.openZoomMeeting();
                
        });   
    }
    //Join the meeting if that is the case
    openZoomMeeting(){
        console.log("/api/check-meeting-time" + "?code=" + this.state.meetingCode)
        fetch(`/api/check-meeting-time?code=${this.state.meetingCode}`)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                test: data.is_time,
            });
        });
    }
    
    //Actual render of the home page.
    renderHomePage(){
        return(
            
            <div className="home-page">
            
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <MeetingRoomSharp />
                    <h1 className="title-homepage">Online Meeting Manager</h1> 
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="default" to="/join" variant="contained" component={Link} >
                        Join a Meeting
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="default" to="/create"  variant="contained" component={Link}>
                        Create a Meeting
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="default" to="/view" variant="contained" component={Link}>
                        View Meetings
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="default" to="/statistics" variant="contained" component={Link}>
                        View Statistics
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" target="_blank" href="https://calendar.google.com/">View your calendar</Button>
                </Grid>
               
            </Grid>
            </div>
        );

    }


    //Defines the pathing of the application
    render(){
        return <Router>
            <Switch> 
                <Route exact path='/' component={this.renderHomePage}>
                </Route>
                <Route path='/join' component={MeetingJoinPage}>
                </Route>
                <Route path='/view' component={ViewMeetings}>
                </Route>
                <Route path='/create' component={CreateMeetingPage}>
                </Route> 
                <Route path='/statistics' component={ViewStatistics}>
                </Route> 
                <Route path='/meeting/:meetingCode' 
                    render={(props) => {
                        return <Meeting {...props} leaveMeetingCallback={this.clearMeetingCode} />;
                    }}
                />
            </Switch>
        </ Router> 
    }


}