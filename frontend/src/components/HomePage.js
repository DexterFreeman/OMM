import React, { Component } from "react";
import CreateMeetingPage from "./CreateMeetingPage";
import MeetingJoinPage from "./MeetingJoinPage";
import Meeting from "./Meeting";
import ViewStatistics from "./ViewStatistics";
import ViewMeetings from "./ViewMeetings";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import {
  Grid,
  Button,
  ButtonGroup,
  Typography,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
} from "@material-ui/core";
import { MeetingRoomSharp } from "@material-ui/icons";
import NavbarComponent from "./navigation/NavbarComponent";

//This is the parent component
export default class HomePage extends Component {
  constructor(props) {
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
  clearMeetingCode() {
    this.setState({
      meetingCode: null,
    });
  }

  //Gets the room code of a meeting the user is in if it's start time is right now.
  async componentDidMount() {
    fetch("/api/user-in-meeting")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          meetingCode: data.code,
        });
        console.log(this.state);
        this.openZoomMeeting();
      });
  }
  //Join the meeting if that is the case
  openZoomMeeting() {
    console.log("/api/check-meeting-time" + "?code=" + this.state.meetingCode);
    fetch(`/api/check-meeting-time?code=${this.state.meetingCode}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          test: data.is_time,
        });
      });
  }

  //Actual render of the home page.
  renderHomePage() {
    return (
      <div className="home-page">
        <NavbarComponent />
        <div className="home-page__main-content">
            <h1>Welcome to Online Meeting Manager!</h1> 
            <p>Online Meeting Manager is a website that helps users create and manage their Zoom meetings. It automatically adds meetings to their Google Calendar and simplifies the process of joining meetings. It's perfect for anyone who attends or hosts online meetings regularly.</p>
            <Link to={"/join"} ><button className="home-btn">Join a Meeting</button></Link>
            <Link to={"/create"} ><button className="home-btn">Create a Meeting</button></Link>

            <Link to={"/view"} ><button className="home-btn">View meetings</button></Link>
            <Link to={"/statistics"} ><button className="home-btn">View statistics</button></Link>
            <Link target="_blank" href="https://calendar.google.com/"><button className="home-btn">Open calendar</button></Link>
     
        </div>
      </div>
    );
  }

  //Defines the pathing of the application
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={this.renderHomePage}></Route>
          <Route path="/join" component={MeetingJoinPage}></Route>
          <Route path="/view" component={ViewMeetings}></Route>
          <Route path="/create" component={CreateMeetingPage}></Route>
          <Route path="/statistics" component={ViewStatistics}></Route>
          <Route
            path="/meeting/:meetingCode"
            render={(props) => {
              return (
                <Meeting
                  {...props}
                  leaveMeetingCallback={this.clearMeetingCode}
                />
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
}
