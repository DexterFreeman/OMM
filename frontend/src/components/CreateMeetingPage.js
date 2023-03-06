import React, {Component} from "react";
import {Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import {Link} from "react-router-dom";
import { Collapse } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { CreateNewFolder, RepeatOneSharp, SystemUpdate } from "@material-ui/icons"
import { withStyles } from "@material-ui/core/styles";


export default class CreateMeetingPage extends Component{
    
    static defaultProps = {
        autoJoin: false,
        durationTime: 60, 
        update: false, 
        meetingCode: null,
        startTime: "",
        topicOfMeeting: "", 
        updateCallback: () => {}
    }
    



    constructor(props){
        super(props); 
        //This is the state of the program, will use these to get information from the frontend to pass into the backend
        this.state = {
            AutoJoin: this.props.autoJoin, 
            StartTime: this.props.startTime,
            DurationTime: this.props.durationTime,
            TopicOfMeeting: this.props.topicOfMeeting,
            errorMsg: "",
            successMsg: "", 
        };
        //Binds methods to the class so these methods have access to the "this" keyword
        this.handleAutoJoinChange = this.handleAutoJoinChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this); 
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this); 
        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);

    }


    //Makes the request to my API to create the meeting in zoom and add it to calendar
   
    handleCreateButtonPressed(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                auto_join: this.state.AutoJoin,
                start_time: this.state.StartTime,
                duration_time: this.state.DurationTime,
                topic_of_meeting: this.state.TopicOfMeeting,
            }),
        };
        fetch('/api/create-meeting', requestOptions)
        
        .then((response) => response.json())
        .then((data) => this.props.history.push("/meeting/" + data.code));   
        
    
    }


    //Methods for handling the changes within the material UI components
    
    handleAutoJoinChange(e){
        this.setState({
            AutoJoin: e.target.value === 'true' ? true: false, //e is the value in the material ui component, sets that value to the according value in the state 
        })
    }

    handleDurationChange(e) {
        this.setState({
            DurationTime: e.target.value,
        });
    }
    handleStartTimeChange(e) {
        this.setState({
            StartTime: e.target.value,
        });
    }
    handleTopicChange(e) {
        this.setState({
            TopicOfMeeting: e.target.value,
        });
    }

    //If it is on the create meeting page, render these buttons
    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleCreateButtonPressed}>Create A Meeting</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>);
    }

    //If it is on the update meeting page, render these buttons
    renderUpdateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>Update A Meeting</Button>
                </Grid>
            </Grid>

        );

    }

    //For update meeting button, loads data from the state and then updates the meeting
    handleUpdateButtonPressed(){ 
        console.log(this.state)
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                auto_join: this.state.AutoJoin,
                start_time: this.state.StartTime,
                duration_time: this.state.DurationTime,
                topic_of_meeting: this.state.TopicOfMeeting,
                code: this.props.meetingCode
            }),
        };
        fetch('/api/update-meeting', requestOptions)
        .then((response) => {
            //This is for error checking
            if (response.ok) {
                this.setState({
                    successMsg: "Meeting Updated",
                });
            } else {
                this.setState({
                    errorMsg: "Error updating meeting",
                });
            }
            //Updates parent component
            this.props.updateCallback(); 
        });
    


    }

    //Render of the page: What the user will see on the frontend
    render(){
        const title = this.props.update ? "Update Meeting" : "Create A Meeting";
        return ( 
            <Grid container spacing={1} >
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != "" ? (<Alert severity="success" onClose={() => {this.setState({successMsg: "",})}}>{this.state.successMsg}</Alert>
                        ) : (<Alert severity="error" onClose={() => {this.setState({errorMsg: "",})}}>{this.state.errorMsg}</Alert>)}
                    </Collapse> 
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title == "Create Meeting" ? (<CreateNewFolder />) : (<SystemUpdate />)}
                        {title}
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">Autojoin the meeting?</div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.autoJoin.toString()} onChange={this.handleAutoJoinChange}>
                            <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" labelPlacement="bottom"/>
                            <FormControlLabel value="false" control={<Radio color="secondary" />} label="No" labelPlacement="bottom"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} defaultValue={this.state.TopicOfMeeting} onChange={this.handleTopicChange}/>
                            <FormHelperText> <div align="center">Name of meeting</div> </FormHelperText>
                    </FormControl>   
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} type="number" onChange={this.handleDurationChange} inputProps={{min: 1, style: {textAlign: "center"}, }} />
                            <FormHelperText> <div align="center">Duration of meeting in mins</div> </FormHelperText>
                    </FormControl>   
                </Grid>

                <Grid item xs={12} align="center">
                <FormControl>
                        <TextField required={true} defaultValue={this.state.StartTime} onChange={this.handleStartTimeChange}/>
                            <FormHelperText > <div align="center">Start time of meeting: Year,Month,Day,Hour,Min</div> </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
            </Grid>


        );        
    }
}