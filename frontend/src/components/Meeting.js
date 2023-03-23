import { Timer, Code, CheckBox, LinkRounded, Security, AvTimer, Title } from '@material-ui/icons';
import React, { Component } from 'react';
import { Grid, Typography, Button } from "@material-ui/core"
import {Link} from "react-router-dom"
import CreateMeetingPage from './CreateMeetingPage';
import NavbarComponent from './navigation/NavbarComponent';

export default class Meeting extends Component {
    constructor(props) {
        super(props);

        //This is the state of the component. It allows me to store values in the frontend, which I use to store data I pull from the backend - which grabs from the database. 
        this.state={
            autoJoin: true,
            durationTime: 60, 
            startTime: "2022,3,7,12,31",
            topicOfMeeting: "test",
            isHost: false, 
            showSettings: false, 
            joinLink: "",  
            meetingPassword: "", 
        }


        //The reason for this code here is to allow these methods to have access to the "this" keyword.
        this.meetingCode = this.props.match.params.meetingCode
        this.deleteButtonPressed = this.deleteButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.backButtonPressed = this.backButtonPressed.bind(this); 
        this.getMeetingDetails= this.getMeetingDetails.bind(this); 
        this.handleMeetingLink = this.handleMeetingLink.bind(this);
        //Runs the method. 
        this.getMeetingDetails(); 
    }


    //Takes in a meeting code and then gets all of the data from that meeting in the database. 
    //If the response is not okay, the meeting will be left to avoid errors. 
    getMeetingDetails() {
        fetch('/api/get-meeting' + '?code=' + this.meetingCode)
        .then((response) => {
            if (!response.ok) {
                this.props.leaveMeetingCallback(); 
                this.props.history.push("/");
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                autoJoin: data.auto_join,
                durationTime: data.duration_time,
                startTime: data.start_time, 
                topicOfMeeting: data.topic_of_meeting,
                isHost: data.is_host,
                joinLink: data.join_link,
                meetingPassword: data.password_of_meeting, 
            });
            console.log(this.state.joinLink);
        });
    }


    //Simply takes the user back. 
    backButtonPressed(){
        this.props.history.push("/")
    }


    //
    deleteButtonPressed(){
        console.log(this.meetingCode)
        const requestOptions = {
            method: "POST", 
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ 
                code: this.state.meetingCode
            })
 
        }
        fetch('/api/leave-meeting', requestOptions).then((_response) => {
            this.props.leaveMeetingCallback(); 
            this.props.history.push("/");
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value, 
        });
    }

    
    renderSettings(){
        console.log(this.state);
        return ( 
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateMeetingPage 
                        update={true} 
                        durationTime={this.state.durationTime} 
                        startTime={this.state.startTime} 
                        topicOfMeeting={this.state.topicOfMeeting} 
                        autoJoin={this.state.autoJoin} 
                        meetingCode={this.meetingCode}
                        updateCallback={this.getMeetingDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                        <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)} >
                            Close
                        </Button>
                    </Grid>
                <Grid item xs={12} align="center">
                </Grid>
            </Grid>
        );
    }


    renderSettingsButton() {
        return (
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.updateShowSettings(true)}
            >
              Settings
            </Button>
          </Grid>
        );
      }


    handleMeetingLink(meetingLink){
        meetingLink = this.state.joinLink
        return meetingLink

    }



    render(){
        
        if (this.state.showSettings){
            return this.renderSettings(); 
        }
        return (
            <div className='normal'>
                <NavbarComponent />
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        <Code />
                        Meeting Code: {this.meetingCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        <Title></Title>
                        Name of meeting: {this.state.topicOfMeeting}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        <CheckBox /> 
                        Auto join: {this.state.autoJoin.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        <AvTimer></AvTimer>
                        Start Time: {this.state.startTime}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        <Timer />
                        Duration time: {this.state.durationTime}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        
                        <LinkRounded /> Meeting Join Link: 
                        <Button target="_blank" href={this.handleMeetingLink("")}>Click here</Button>
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        <Security></Security>
                        Password: {this.state.meetingPassword}
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.deleteButtonPressed} >
                        Delete Meeting 
                    </Button>
                </Grid>                
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="default" onClick={this.backButtonPressed} >
                        Leave Meeting 
                    </Button>
                </Grid>
            </Grid>
            </div>
        )
    }
}


