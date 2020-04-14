import React from "react";
import AppMode from "../AppMode.js";

class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.mode === AppMode.RECIPES_ADDRECIPE) {
      this.state = {
        name: "",
        ingredients: [],
        directions: [],
        cookTime: 0,
        pictureURL: "",
        dateAdded: "",
        favorited: false,
        faIcon: "fa fa-save",
        btnLabel: "Save Recipe",
      };
    } else {
      this.state = this.props.startData;
      this.state.faIcon = "fa fa-edit";
      this.state.btnLabel = "Update Recipe";
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = (event) => {
    //start spinner
    this.setState({
      faIcon: "fa fa-spin fa-spinner",
      btnLabel:
        this.props.mode === AppMode.RECIPES_ADDRECIPE
          ? "Saving..."
          : "Updating...",
    });
    //to be saved
    let recipeData = this.state;
    delete recipeData.faIcon;
    delete recipeData.btnLabel;
    //1 second delay to show spinning icon
    setTimeout(this.props.saveRecipe, 1000, recipeData);
    event.preventDefault();
  };

  addDirection(e) {
    e.preventDefault();
    this.setState({ directions: [...this.state.directions, ""] });
  }

  addIngredient(e) {
    e.preventDefault();
    let ingredientArray = [];
    ingredientArray.name = "";
    ingredientArray.quantity = "";
    ingredientArray.unit = "";
    this.setState({ ingredients: [...this.state.ingredients, ingredientArray] });

  }

  handleChange2(e, index) {
    this.state.directions[index] = e.target.value;
    this.setState({ directions: this.state.directions });
    
  }

  handleChange31(e, index) {
    this.state.ingredients[index].name = e.target.value;
    this.setState({ ingredients: this.state.ingredients });
  }

  handleChange32(e, index) {
    this.state.ingredients[index].quantity = e.target.value;
    this.setState({ ingredients: this.state.ingredients });
  }

  handleChange33(e, index) {
    this.state.ingredients[index].unit = e.target.value;
    this.setState({ ingredients: this.state.ingredients });
  }

  handleRemove(e, index) {
    e.preventDefault();
    this.state.directions.splice(index, 1);
    this.setState({ directions: this.state.directions });
  }

  handleRemove2(e, index) {
    e.preventDefault();
    this.state.ingredients.splice(index, 1);
    this.setState({ ingredients: this.state.ingredients });
  }

  render() {
    return (
      <div className="paddedPage">
        <form onSubmit={this.handleSubmit}>
          <p></p>
          <center>
            <label htmlFor="name">
              Recipe Name:
              <input
                value={this.state.name}
                name="name"
                id="name"
                class="form-control form-center "
                type="text"
                required
                onChange={this.handleChange}
              />
            </label>
            <p />
            <label htmlFor="cookTime">
              Cook Time (minutes):
              <input
                value={this.state.cookTime}
                name="cookTime"
                id="cookTime"
                class="form-control form-center"
                required
                onChange={this.handleChange}
              />
            </label>
            <p />
            <div className="list-groupings">
              <div className="ingredient-grouping">
                <label>Ingredients:</label>
                {this.state.ingredients.map((step, index) => {
                  return (
                    <div key={index}>
                      <div className="direction-item">
                        <input
                          placeholder="ingredient name"
                          className="ingredient-input ingredient-name"
                          onChange={(e) => this.handleChange31(e, index)}
                          value={step.name}
                        />
                        <input
                          placeholder="quantity"
                          type="number"
                          className="ingredient-input"
                          onChange={(e) => this.handleChange32(e, index)}
                          value={step.quantity}
                        />
                        <input
                          placeholder="unit"
                          className="ingredient-input"
                          onChange={(e) => this.handleChange33(e, index)}
                          value={step.unit}
                        />
                        &nbsp;&nbsp;
                        <button
                          className="loginBtn btn
                    btn-block btncolortheme"
                          onClick={(e) => this.handleRemove2(e, index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  className="addBtn"
                  onClick={(e) => this.addIngredient(e)}
                >
                  <span className="fa fa-plus"></span>
                </button>
              </div>

              <div className="direction-grouping">
                <label>Directions:</label>
                {this.state.directions.map((step, index) => {
                  return (
                    <div key={index}>
                      <div className="direction-item">
                        {index + 1}.&nbsp;
                        <input
                          onChange={(e) => this.handleChange2(e, index)}
                          value={step}
                        />
                        &nbsp;&nbsp;
                        <button
                          className="loginBtn btn
                    btn-block btncolortheme"
                          onClick={(e) => this.handleRemove(e, index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  className="addBtn"
                  onClick={(e) => this.addDirection(e)}
                >
                  <span className="fa fa-plus"></span>
                </button>
              </div>
            </div>
            <p />
            <label className="pictureURL-form" htmlFor="pictureURL">
              Picture URL:
              <input
                value={this.state.pictureURL}
                name="pictureURL"
                id="pictureURL"
                class="form-control form-center"
                required
                onChange={this.handleChange}
              />
            </label>
            <p />
            <button
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

export default RecipeForm;
