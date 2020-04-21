import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";
import RecipeSearch from "./RecipeSearch.js"

class RecipesTable extends React.Component {
  constructor(props) {
    super(props);
    //confirmDelete state variable determines whether to show or hide the
    //confirm delete dialog box
    //filtered represents the filtered list of user recipes
    this.state = {
        confirmDelete: false,
        filtered: this.props.recipes
    };
  }

  // called when this component receives new props.
  // initializes the filtered recipes list since this component is constructed and mounted
  //  before the recipe componenet is finished fetching the users recipes 
  componentWillReceiveProps() {
    this.setState({filtered: this.props.recipes})
  }

  confirmDelete = (id) => {
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

  viewRecipe = (id) => {
    this.props.setViewId(id);
    this.props.setEditId(id);
    this.props.changeMode(AppMode.RECIPES_VIEWRECIPE);
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
                className="loginBtn btn confirm-delete-btn"
                onClick={this.doDelete}
              >
                YES
              </button>
              <button
                className="loginBtn btn confirm-delete-btn"
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
    for (let b = 0; b < this.state.filtered.length; ++b) {
      table.push(
        <tr key={b} onClick={this.props.menuOpen ? null : () => this.viewRecipe(b)}>
          <td>{this.state.filtered[b].name}</td>
          <td>{this.state.filtered[b].cookTime}</td>
        </tr>
      );
    }
    return table;
  };

  updateFilteredRecipes = (newFilteredList) => {
      this.setState({ filtered: newFilteredList})
  }

  render() {
    return (
      <div className="paddedPage">
        <RecipeSearch
          updateFilteredRecipes={this.updateFilteredRecipes}
          allRecipes={this.props.recipes}
        />
        <h1 style={{display: "inline-block", textAlign: "center", position: "absolute", left: "50%", marginLeft: "-110px"}}>
          Your Recipes
        </h1>

        <table className="table table-hover recipesTable">
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Cook Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.filtered).length === 0 ? (
              <tr>
                <td colSpan="7" style={{ fontStyle: "italic" }}>
                  No recipes found
                </td>
              </tr>
            ) : (
              this.renderTable()
            )}
          </tbody>
        </table>
        {this.state.confirmDelete ? this.renderConfirmDeleteDialog() : null}
      </div>
    );
  }
}

export default RecipesTable;
