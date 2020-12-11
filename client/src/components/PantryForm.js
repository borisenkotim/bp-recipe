import React from "react";
import AppMode from "../AppMode";

class PantryForm extends React.Component{
    constructor(props){
        super(props);
        if (this.props.mode === AppMode.PANTRY_ADDINGREDIENT) {
            this.state = {
              name: "",
              calories: "",
              pictureURL: "",
              unit: "units",
              expiration: "",
              quantity: "",
              faIcon: "fa fa-save",
              btnLabel: "Save Ingredient"
            };
          }
          else if (this.props.mode === AppMode.GROCERY_ADDINGREDIENT){
            this.state = {
                name: "",
                calories: "",
                pictureURL: "",
                unit: "units",
                expiration: "",
                quantity: "",
                faIcon: "fa fa-save",
                btnLabel: "Add to Cart"
              };
        }
        else if (this.props.mode === AppMode.PANTRY_EDITINGREDIENT){
            this.state = this.props.startData;
            this.state.faIcon = "fa fa-edit";
            this.state.btnLabel = "Update Ingredient";
          }
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
                <p></p>
                <center>
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
              <p />
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
            <p />
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
            <p />
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
            <p />
            <label htmlFor="expiration">
              Expiration Date:
              <input
                value={this.state.expiration}
                name="expiration"
                id="expiration"
                className="form-control form-center"
                onChange={this.handleChange}
              />
            </label>
            <button
              id="pantrySubmit"
              type="submit"
              onClick={this.props.handleChange}
              className="loginBtn btn btn-primary
                    btn-block btncolortheme"
              style={{ width: "230px", fontSize: "20px", zindex: 110 }}
            >
              <span className={this.state.faIcon} />
              &nbsp;{this.state.btnLabel}
            </button>
            </center>
            </form>
        </div>
        );
    }

}

export default PantryForm;