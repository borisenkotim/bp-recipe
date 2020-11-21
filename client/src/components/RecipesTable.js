import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";
import RecipeSearch from "./RecipeSearch.js";
import Card from "./Card.jsx"; 
import RecipeSort from "./RecipeSort.js";
import RecipeForm from "./RecipeForm.js";

class RecipesTable extends React.Component {
  constructor(props) {
    super(props);
    //confirmDelete state variable determines whether to show or hide the
    //confirm delete dialog box
    //filtered represents the filtered list of user recipes
    this.state = {
      filtered: this.props.recipes,
    };
  }

  // called when this component receives new props.
  // initializes the filtered recipes list since this component is constructed and mounted
  //  before the recipe componenet is finished fetching the users recipes
  componentWillReceiveProps() {
    this.setState({ filtered: this.props.recipes });
  }

  viewRecipe = (id) => {
    this.props.setViewId(id);
    this.props.setEditId(id);
    this.props.changeMode(AppMode.RECIPES_VIEWRECIPE);
  };

  renderCards = () => {
    let col = [];
    for (let b = 0; b < this.state.filtered.length; b += 1) {
      col.push(
        <div className="recipe-card-div">
          <span
            className="recipe-card-span"
            key={this.props.recipes.indexOf(this.state.filtered[b])}
            onClick={this.props.menuOpen ? null : () => this.viewRecipe(this.props.recipes.indexOf(this.state.filtered[b]))}
          >
            {" "}
            <Card
              data={this.state.filtered[b]}
              id={this.props.recipes.indexOf(this.state.filtered[b])}
              saveRecipe={this.props.saveRecipe}
            />
          </span>
        </div>
      );
    }

    return col;
  };

  updateFilteredRecipes = (newFilteredList) => {
    this.setState({ filtered: newFilteredList });
    //Force update of component so that Recipes will display correctly.
    this.forceUpdate();
  };

  render() {
    return (
      <div className="paddedPage">
        <RecipeSearch
          updateFilteredRecipes={this.updateFilteredRecipes}
          allRecipes={this.props.recipes}
        />
        <h1
          style={{
            display: "inline-block",
            textAlign: "center",
            position: "absolute",
            left: "50%",
            marginLeft: "-135px",
          }}
        >
          Your Recipes
        </h1>
        <RecipeSort
          updateFilteredRecipes={this.updateFilteredRecipes}
          recipeList={this.state.filtered}
        />

        <div>
          {Object.keys(this.state.filtered).length === 0 ? (
            <p>No recipes found</p>
          ) : (
            <div className="recipe-cards-container">
                {this.renderCards()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RecipesTable;
