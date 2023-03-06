import React, { Component } from "react"; 
import { render } from "react-dom"; 
import HomePage from "./HomePage";

export default class App extends Component{ 
    constructor(props){
        super(props); 
    }
    //Renders the homepage on start, uses the "normal" class
    render(){
        return (<div className="normal">
            <HomePage />
        </div>
        );
    }
}

//Forces app to render
const appDiv = document.getElementById("app");
render(<App/>, appDiv);