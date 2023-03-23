import React, {Component} from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {MeetingRoom} from "@material-ui/icons"
import NavbarComponent from "./navigation/NavbarComponent";
export default class MeetingJoinPage extends Component{
    constructor(props){
        super(props); 
        this.state = {
            meetingCode: "",
            error: "",
        };

        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.meetingButtonPressed = this.meetingButtonPressed.bind(this);
    }



    //Updates the state whenever something in the frontend is changed
    handleTextFieldChange(e){
        this.setState({
            meetingCode: e.target.value, 
        });
    }

    //Makes request to backend, if the meeting code inputted to the frontend is both a meeting that exists and the user is a host of then allow them into the meeting
    //(403 HTTP response is forbidden I.E not host)  
    //(Other return would be HTTP 400)
    meetingButtonPressed(){
        const requestOptions = {
            method: "POST", 
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ 
                code: this.state.meetingCode
            })
        };
        fetch('api/join-meeting', requestOptions).then((response) => {
            if (response.ok) {
                this.props.history.push(`/meeting/${this.state.meetingCode}`);
            } 
            if (response.status === 403) {
                this.setState({error: "You are not the host"})
            }
            else {
                this.setState({error: "Meeting not found"})
            }
        }).catch((error) => {
            console.log(error);
        }); 
    }


    //Render of the page, on change actions are defined in the functions above. 
    render(){
        return (
            <Grid container spacing={1}>
                <NavbarComponent />
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Join a Meeting
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField error={this.state.error} label="code" placeholder="Enter a meeting code" 
                    value={this.state.meetingCode} helperText={this.state.error} variant="outlined" onChange={this.handleTextFieldChange}>
                    </TextField>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.meetingButtonPressed}>
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}> Back </Button>
                </Grid>
            </Grid>
        );
    }


}

