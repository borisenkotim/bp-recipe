import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";

class ViewRecipePage extends React.Component {
    constructor(props) {
      super(props);
      //confirmDelete state variable determines whether to show or hide the
      //confirm delete dialog box
      this.state = this.props.data
      this.state.confirmDelete = false
    }
  
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
  
    //Update the favorited field in database
    favoriteClicked = () => {
      var newData = this.state;
      if(this.state.favorited){
        this.setState({favorited: false})
        newData.favorited = false;
      }else{
        this.setState({favorited: true});
        newData.favorited = true;
      }

      delete newData.confirmDelete;
      this.props.editRecipe(newData, this.props.id);
      this.props.changeMode(AppMode.RECIPES_VIEWRECIPE);
    }

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
  
    renderRecipeImage = () => {
        return (
            <img
                src={this.state.pictureURL}
                height="200"
                style={{float: "left"}}
                alt="No Image Found"
            />)
    }

    renderIngredients = () => {
        let ingredients = []
        //if the data are ingredients objects
        for(let i = 0; i < this.state.ingredients.length; ++i){
            if(this.state.ingredients[i].pictureURL){
                ingredients.push(
                    <tr key={i}>
                        <td><img src={this.state.ingredients[i].pictureURL} height="40" width="40"/></td>
                        <td>{this.state.ingredients[i].name}</td>
                        <td>{this.state.ingredients[i].quantity} {this.state.ingredients[i].unit}</td>

                    </tr>
                )
            }else{
                ingredients.push(
                    <tr key={i}>
                        <td><i>No Image</i></td>
                        <td>{this.state.ingredients[i].name}</td>
                        <td>{this.state.ingredients[i].quantity} {this.state.ingredients[i].unit}</td>
                    </tr>
                )
            }
        }
        
        return ingredients;
    }

    renderDirections = () => {
        let directions = []
        for(let i = 0; i < this.state.directions.length; ++i){
            directions.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{this.state.directions[i]}</td>
                </tr>
            )
        }
        return directions;
    }
    
    render() {
        return (
            <div className="paddedPage">
                <div className="recipeContent">
                  <div>
                    {this.state.pictureURL ? this.renderRecipeImage() : null}  
                    <div className="recipeContentTitleInfo">
                        <div>
                            <h1>{this.state.name} <span className={"fa fa-star " + (this.state.favorited ? "favorited" : "unfavorited")} onClick={this.favoriteClicked}></span></h1>                            
                        </div>
                        <h3 className="recipeContentTitleInfoSubInfo">Added: {this.state.dateAdded}</h3>
                        <h3 className="recipeContentTitleInfoSubInfo">Cook Time: {this.state.cookTime} minutes</h3>
                    </div>
                  </div>

                  <div className="recipeContentListInfo">
                    <h4>Ingredients</h4>
                    <table className="table table-hover ingredientsTable">
                        <tbody>
                            {this.renderIngredients()}
                        </tbody>
                    </table>

                    <h4>Directions</h4>
                    <table className="table table-hover directionsTable">
                        <tbody>
                            {this.renderDirections()}
                        </tbody>
                    </table>
                  </div>
                  
                  {this.state.confirmDelete ? this.renderConfirmDeleteDialog() : null}
                  
              </div>
            </div>
                
        );
    }
}
  
  export default ViewRecipePage;
  