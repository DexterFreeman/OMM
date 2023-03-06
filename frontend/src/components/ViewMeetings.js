import { DataUsage, RepeatOneSharp, ThreeSixty } from '@material-ui/icons';
import React, { Component } from 'react';
import { Grid, List, Typography, Button, ListItem, CardActions, AppBar, CardContent, CardMedia, CssBaseline, Toolbar } from "@material-ui/core"
import {Computer} from "@material-ui/icons"
import {Link} from "react-router-dom"
import CreateMeetingPage from './CreateMeetingPage';

export default class ViewMeetings extends Component {
    constructor(props) {
        super(props);
        this.state={
            average: 0,
            number: 0, 
            time: 0, 
            codes: "",
            topics: '', 
        }

    }


//componentDidMount function. Fetches all the codes and topic of the meetings the user is a host of from the backend and returns them.
//These values are then set to the state of this class to be accessed elsewhere in this code. 

    async componentDidMount() {
        fetch('/api/get-meetings-user')
        .then((response) => { return response.json();})
        .then((data) => {
            console.log(data)
            this.setState({
                codes: data[0].split(","),
                topics: data[1].split(","),
    
            });
        });
    }

//This creates the list items components and is the logic that actually lists all of the meetings. 
//Uses a simple linear search to go through the data collected from the component did mount function. 
//i needed to be passed in otherwise the variable couldn't be found and the code would throw an error. 
    createElements(i, number){
        var elements = [];
        for(i =0; i < number-1; i++){
            elements.push(<ListItem alignItems='center'>Name: {this.state.topics[i]} Code: {this.state.codes[i]}</ListItem>);
            
        }
        return elements;
    }
    
//The render is very similar to previous pages, only logic that is different is that it uses a component I haven't used beforehand: List. 
//List takes in list items, which is set by the createElements function.

    render(){
        return (
            <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh'}}>
                <Grid item xs={12} align="center">
                    <Typography variant='h3' component='h3'>
                        Meetings List
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" target="_blank" href="https://us04web.zoom.us/meeting#/upcoming">View Meetings in Zoom</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}> Back to homepage </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <List>
                        {this.createElements(0, this.state.codes.length)}
                    </List>
                </Grid>
                
            </Grid>
        );
    }

}