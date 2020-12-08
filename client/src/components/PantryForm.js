import React from "react";
import AppMode from "../AppMode";
import { Icon, Label } from 'semantic-ui-react';

class PantryForm extends React.Component{
    constructor(props){
        super(props);
        this.state = this.props.pantryData;
    }

    //handle change
    handleChange = (event) => {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    };

    //handling Submit
    handleSubmit = (event) => {
        //start spinner
        this.setState({
          faIcon: "fa fa-spin fa-spinner",
          btnLabel:
            this.props.mode === AppMode.PANTRY_ADDINGREDIENT
              ? "Saving..."
              : "Updating...",
        });
        //to be saved
        let pantryData = this.state;
        delete pantryData.faIcon;
        delete pantryData.btnLabel;
        delete pantryData.confirmDelete;
        //1 second delay to show spinning icon
        setTimeout(this.props.savePantry, 1000, pantryData);
        event.preventDefault();
      };

    //render function
    render(){
        return(
        <div className="paddedPage">
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="name">Ingredient Name:
                <input
                value={this.state.name}
                name="name"
                id="name"
                className="form-control form-center "
                type="text"
                required
                onChange={this.handleChange}
              /> </label>
               <label htmlFor="calories">
              Calories:
              <input
                value={this.state.calories}
                name="calories"
                id="calories"
                className="form-control form-center"
                onChange={this.handleChange}
              />
            </label>
            <label className="pictureURL-form" htmlFor="pictureURL">
              Picture URL:
              <input
                value={this.state.pictureURL}
                name="pictureURL"
                id="pictureURL"
                className="form-control form-center"
                required
                onChange={this.handleChange}
              />
            </label>
            <label htmlFor="calories">
              Quantity:
              <input
                value={this.state.quantity}
                name="quantity"
                id="quantity"
                className="form-control form-center"
                onChange={this.handleChange}
              />
            <label htmlFor="unit">
              Units:
              <input
                value={this.state.unit}
                name="unit"
                id="unit"
                className="form-control form-center"
                onChange={this.handleChange}
              />
            </label>
            </label>
            <label htmlFor="calories">
              Expiration Date:
              <input
                value={this.state.expiration}
                name="expiration"
                id="expiration"
                className="form-control form-center"
                onChange={this.handleChange}
              />
            </label>

            </form>
        </div>
        );
    }

}

export default PantryForm;