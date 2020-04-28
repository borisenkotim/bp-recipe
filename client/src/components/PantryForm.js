import React from "react";
import AppMode from "../AppMode";
import { Icon, Label } from 'semantic-ui-react';

class PantryForm extends React.Component{
    constructor(props){
        super(props);

        
    }

    //handle change
    handleChange = (event) => {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    };

    //handling Submit
    handleSubmit = (event) => {

    };

    //render function
    render(){
        return(
        <div className="paddedPage">
            <form onSubmit={this.handleSubmit}>
                <p></p>
                <center>
                    <label>
                        <Icon name= "My Recipe List">

                        </Icon>
                    </label>
                </center>
            </form>
        </div>
        );
    }

}