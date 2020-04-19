import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";

class ViewRecipePage extends React.Component {
  constructor(props) {
    super(props);
    //confirmDelete state variable determines whether to show or hide the
    //confirm delete dialog box
    this.state = this.props.data;
    this.state.confirmDelete = false;
    this.state.viewMode = true;
  }

  handleChange = (event) => {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  };

  confirmDelete = () => {
    this.setState({ confirmDelete: true });
  };

  doDelete = () => {
    this.props.deleteRecipe(this.props.id);
    this.setState({ confirmDelete: false });
  };

  //cancelDelete -- Triggered when the user chooses to cancel a delete
  //operation. We just need to update state to toggle confirmDelete to false
  cancelDelete = () => {
    this.setState({ confirmDelete: false });
  };

  //Update the favorited field in database
  favoriteClicked = () => {
    var newData = this.state;
    if (this.state.favorited) {
      this.setState({ favorited: false });
      newData.favorited = false;
    } else {
      this.setState({ favorited: true });
      newData.favorited = true;
    }

    delete newData.confirmDelete;
    this.props.editRecipe(newData, this.props.id, AppMode.RECIPES_VIEWRECIPE);
  };

  changeToEditMode = () => {
    if (this.state.viewMode) {
      this.setState({ viewMode: false })
    }
    // if we were in edit mode, but are going back
    // to view mode, we will want to save any changes
    else {
      this.setState({ viewMode: true });
      let recipeData = this.state;
      delete recipeData.faIcon;
      delete recipeData.btnLabel;
      delete recipeData.confirmDelete;
      delete recipeData.viewMode;
      setTimeout(this.props.saveRecipe, 1000, recipeData);
    }
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

  renderRecipeImage = () => {
    return (
      <img
        src={this.state.pictureURL}
        height="200"
        style={{ float: "left" }}
        alt="No Image Found"
      />
    );
  };

  addDirection(e) {
    e.preventDefault();
    this.setState({ directions: [...this.state.directions, ""] });
  }

  addIngredient(e) {
    e.preventDefault();
    let ingredientObj = {};
    ingredientObj.name = "";
    ingredientObj.quantity = 0;
    ingredientObj.unit = "";
    this.setState({
      ingredients: [...this.state.ingredients, ingredientObj],
    });
  }

  renderIngredients = () => {
    let ingredients = [];
    //if the data are ingredients objects
    for (let i = 0; i < this.state.ingredients.length; ++i) {
      ingredients.push(
        <tr key={i}>
          <td>{this.state.ingredients[i].name}</td>
          <td>
            {this.state.ingredients[i].quantity}{" "}
            {this.state.ingredients[i].unit}
          </td>
          {this.state.ingredients[i].pictureURL && (
            <td>
              <img
                src={this.state.ingredients[i].pictureURL}
                height="40"
                width="40"
              />
            </td>
          )}
        </tr>
      );
    }

    return ingredients;
  };

  handleChangeIngredientName(e, index) {
    this.state.ingredients[index].name = e.target.value;
    this.setState({ ingredients: this.state.ingredients });
  }

  handleChangeIngredientQuantity(e, index) {
    this.state.ingredients[index].quantity = parseFloat(e.target.value);
    this.setState({ ingredients: this.state.ingredients });
  }

  handleChangeIngredientUnit(e, index) {
    this.state.ingredients[index].unit = e.target.value;
    this.setState({ ingredients: this.state.ingredients });
  }

  renderIngredientsEditMode = () => {
    let ingredients = [];
    //if the data are ingredients objects
    for (let i = 0; i < this.state.ingredients.length; ++i) {
      ingredients.push(
        <tr key={i}>
          <td>
            {" "}
            <input
              className="ingredient-name-input"
              onChange={(e) => this.handleChangeIngredientName(e, i)}
              value={this.state.ingredients[i].name}
            />
          </td>
          <td>
            <input
              type="number"
              onChange={(e) => this.handleChangeIngredientQuantity(e, i)}
              value={this.state.ingredients[i].quantity}
            />
            <input
              onChange={(e) => this.handleChangeIngredientUnit(e, i)}
              value={this.state.ingredients[i].unit}
            />
          </td>
          {this.state.ingredients[i].pictureURL && (
            <td>
              <img
                src={this.state.ingredients[i].pictureURL}
                height="40"
                width="40"
              />
            </td>
          )}
          <td className="x-table-col">
            <button
              className="loginBtn btn"
              onClick={(e) => this.handleRemoveIngredient(e, i)}
            >
              X
            </button>
          </td>
        </tr>
      );
    }

    return ingredients;
  };

  handleRemoveDirection(e, index) {
    e.preventDefault();
    this.state.directions.splice(index, 1);
    this.setState({ directions: this.state.directions });
  }

  handleRemoveIngredient(e, index) {
    e.preventDefault();
    this.state.ingredients.splice(index, 1);
    this.setState({ ingredients: this.state.ingredients });
  }

  renderDirections = () => {
    let directions = [];
    for (let i = 0; i < this.state.directions.length; ++i) {
      directions.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{this.state.directions[i]}</td>
        </tr>
      );
    }
    return directions;
  };

  renderDirectionsEditMode = () => {
    let directions = [];
    for (let i = 0; i < this.state.directions.length; ++i) {
      directions.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            {" "}
            <input
              onChange={(e) => this.handleChangeDirection(e, i)}
              value={this.state.directions[i]}
              className="table-input"
            />
          </td>
          <td className="x-table-col">
            <button
              className="loginBtn btn"
              onClick={(e) => this.handleRemoveDirection(e, i)}
            >
              X
            </button>
          </td>
        </tr>
      );
    }
    return directions;
  };

  render() {
    return (
      <div className="paddedPage">
        <div className="recipeContent">
          <div>
            {this.state.pictureURL ? this.renderRecipeImage() : null}
            <div className="recipeContentTitleInfo">
              <div>
                <h1 className="view-name-grouping">
                  {this.state.viewMode ? (
                    <p>{this.state.name} </p>
                  ) : (
                    <label htmlFor="name">
                      <input
                        value={this.state.name}
                        name="name"
                        id="name"
                        className="name-edit-input"
                        type="text"
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                  )}
                  <span
                    className={
                      "fa fa-star " +
                      (this.state.favorited ? "favorited" : "unfavorited")
                    }
                    onClick={this.favoriteClicked}
                  ></span>
                </h1>
              </div>
              <h3 className="recipeContentTitleInfoSubInfo">
                Added: {this.state.dateAdded}
              </h3>
              <h3 className="recipeContentTitleInfoSubInfo">
                {this.state.viewMode ? (
                  <p>Cook Time: {this.state.cookTime} minutes</p>
                ) : (
                  <label htmlFor="cookTime">
                    Cook Time:
                    <input
                      value={this.state.cookTime}
                      name="cookTime"
                      id="cookTime"
                      className="cooktime-edit-input"
                      required
                      onChange={this.handleChange}
                    />{" "}
                    minutes
                  </label>
                )}
              </h3>
              {!this.state.viewMode && (
                <label>
                  Picture URL:
                  <input
                    className="picture-url-input"
                    value={this.state.pictureURL}
                    onChange={this.handleChange}
                  />
                </label>
              )}
            </div>
            <div className="view-recipe-btn-family">
              <div>
                <span
                  className={
                    this.state.viewMode
                      ? "view-recipe-btn view-recipe-btn-edit fa fa-edit"
                      : "view-recipe-btn view-recipe-btn-edit fa fa-save"
                  }
                  onClick={this.changeToEditMode}
                ></span>
              </div>
              <div>
                <span
                  className="view-recipe-btn fa fa-trash"
                  onClick={this.confirmDelete}
                ></span>
              </div>
            </div>
          </div>

          <div className="recipeContentListInfo">
            <h4>
              Ingredients{" "}
              {!this.state.viewMode && (
                <button
                  className="addBtn"
                  onClick={(e) => this.addIngredient(e)}
                >
                  <span className="fa fa-plus"></span>
                </button>
              )}
            </h4>
            <table className="table table-hover ingredientsTable">
              <tbody>
                {this.state.viewMode
                  ? this.renderIngredients()
                  : this.renderIngredientsEditMode()}
              </tbody>
            </table>

            <h4>
              Directions{" "}
              {!this.state.viewMode && (
                <button
                  className="addBtn"
                  onClick={(e) => this.addDirection(e)}
                >
                  <span className="fa fa-plus"></span>
                </button>
              )}
            </h4>
            <table className="table table-hover directionsTable">
              <tbody>
                {this.state.viewMode
                  ? this.renderDirections()
                  : this.renderDirectionsEditMode()}
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
