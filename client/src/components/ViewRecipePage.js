import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";

class ViewRecipePage extends React.Component {
    constructor(props) {
      super(props);
      //confirmDelete state variable determines whether to show or hide the
      //confirm delete dialog box
      this.state = { confirmDelete: false };
    }
  
    editRecipe = id => {
      this.props.setEditId(id);
      this.props.changeMode(AppMode.RECIPES_EDITRECIPE);
    };
  
    confirmDelete = id => {
      this.props.setDeleteId(id);
      this.setState({ confirmDelete: true });
    };
  
    doDelete = () => {
      this.props.deleteRecipe();
      this.setState({ confirmDelete: false });
    };
  
    //cancelDelete -- Triggered when the user chooses to cancel a delete
    //operation. We just need to update state to toggle confirmDelete to false
    cancelDelete = () => {
      this.props.setDeleteId("");
      this.setState({ confirmDelete: false });
    };
  
    renderConfirmDeleteDialog = () => {
      return (
        <div className="modal" role="dialog">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title">Confirm Recipe Deletion</p>
              <button className="close-modal-button" onClick={this.cancelDelete}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <center>
                <h4>Are you sure that you want to delete this recipe?</h4>
              </center>
              <div className="modal-footer">
                <button
                  className="loginBtn btn btn-primary btn-color-scheme"
                  onClick={this.doDelete}
                >
                  YES
                </button>
                <button
                  className="loginBtn btn btn-secondary"
                  onClick={this.cancelDelete}
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
  
    renderTable = () => {
      let table = [];
      for (let b = 0; b < this.props.recipes.length; ++b) {
        table.push(
          <tr key={b}>
            <td>{this.props.recipes[b].name}</td>
            <td>{this.props.recipes[b].cookTime}</td>
            <td>
              <button
                onClick={this.props.menuOpen ? null : () => this.editRecipe(b)}
              >
                <span className="fa fa-binoculars"></span>
              </button>
            </td>
            <td>
              <button
                onClick={this.props.menuOpen ? null : () => this.confirmDelete(b)}
              >
                <span className="fa fa-trash"></span>
              </button>
            </td>
          </tr>
        );
      }
      return table;
    };
  
    renderRecipeImage = () => {
        return (
            <img
                src={this.props.data.pictureURL}
                height="200"
                style={{float: "left"}}
            />)
    }

    renderIngredients = () => {
        let ingredients = []
        if(!this.props.data.ingredients[0].name){
            //if the data in the ingredient are raw strings
            for(let i = 0; i < this.props.data.ingredients.length; ++i){
                ingredients.push(
                    <tr key={i}>
                        <td>{this.props.data.ingredients[i]}</td>
                    </tr>
                )
            }
        }else{
            //if the data are ingredients objects
            for(let i = 0; i < this.props.data.ingredients.length; ++i){
                if(this.props.data.ingredients[i].pictureURL){
                    ingredients.push(
                        <tr key={i}>
                            <td>{this.props.data.ingredients[i].name}</td>
                            <td><img src={this.props.data.ingredients[i].pictureURL} height="40" width="40"/></td>
                            <td>{this.props.data.ingredients[i].quantity} {this.props.data.ingredients[i].unit}</td>
    
                        </tr>
                    )
                }else{
                    ingredients.push(
                        <tr key={i}>
                            <td>{this.props.data.ingredients[i].name}</td>
                            <td>No Image</td>
                            <td>{this.props.data.ingredients[i].quantity} {this.props.data.ingredients[i].unit}</td>
                        </tr>
                    )
                }
            }
        }

        return ingredients;
    }

    renderDirections = () => {
        let directions = []
        for(let i = 0; i < this.props.data.directions.length; ++i){
            directions.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{this.props.data.directions[i]}</td>
                </tr>
            )
        }
        return directions;
    }
    
    render() {
        return (
            <div className="paddedPage">
                {this.props.data.pictureURL ? this.renderRecipeImage() : null}  
                <div className="titleInfo" style={{display: "inline;", float: "left;"}}>
                    <h1>{this.props.data.name}</h1>
                    {this.props.data.favorited ? (<span className="fa fa-star" style={{float: "left"}}></span>) : null}
                    <h3>Added: {this.props.data.dateAdded}</h3>
                    <h3>Cook Time: {this.props.data.cookTime} minutes</h3>
                </div>


                <table className="table table-hover ingredientsTable">
                    <tbody>
                        {this.renderIngredients()}
                    </tbody>
                </table>

                <table className="table table-hover directionsTable">
                    <tbody>
                        {this.renderDirections()}
                    </tbody>
                </table>
                {this.state.confirmDelete ? this.renderConfirmDeleteDialog() : null}
                
            </div>
        );
    }
}
  
  export default ViewRecipePage;
  