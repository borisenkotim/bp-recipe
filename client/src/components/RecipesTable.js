import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";

class RecipesTable extends React.Component {
  constructor(props) {
    super(props);
    //confirmDelete state variable determines whether to show or hide the
    //confirm delete dialog box
    this.state = { confirmDelete: false };
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
    for (let b = 0; b < this.props.recipes.length; ++b) {
      table.push(
        <tr key={b} onClick={this.props.menuOpen ? null : () => this.viewRecipe(b)}>
          <td>{this.props.recipes[b].name}</td>
          <td>{this.props.recipes[b].cookTime}</td>
        </tr>
      );
    }
    return table;
  };

  render() {
    return (
      <div className="paddedPage">
        <center>
          <h1>Your Recipes</h1>
        </center>

        <table className="table table-hover recipesTable">
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Cook Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.recipes).length === 0 ? (
              <tr>
                <td colSpan="7" style={{ fontStyle: "italic" }}>
                  No data recorded
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
