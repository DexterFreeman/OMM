import { DataUsage, RepeatOneSharp, ThreeSixty } from '@material-ui/icons';
import React, { Component } from 'react';
import { Grid, List, Typography, Button } from "@material-ui/core"
import {Link} from "react-router-dom"
import NavbarComponent from './navigation/NavbarComponent';
export default class ViewStatistics extends Component {
    constructor(props) {
        super(props);
        this.state={
            average: 0,
            number: 0, 
            time: 0, 
        }
    }

    async componentDidMount() {
        fetch('/api/get-statistics')
        .then((response) => { return response.json();})
        .then((data) => {
            console.log(data)
            this.setState({
                time: data[0],
                number: data[1],
                average: data[2],
            });
            console.log(this.state.average);
        });
    }

    render(){
        return (
            <Grid container spacing={3} justify="flex-end">
                <NavbarComponent />
                <Grid item xs={12} align="center">
                    <Typography variant='h3' component='h3'>
                        Statistics
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography>
                        Number Of Meetings: {this.state.number}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography>
                        Average time of meetings: {this.state.average}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography>
                        Total Time: {this.state.time}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}> Back </Button>
                </Grid>
            </Grid>
        );
    }
}