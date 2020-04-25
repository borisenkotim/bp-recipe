import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";
import RecipeSearch from "./RecipeSearch.js";
import Card from "./Card.jsx";

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

  renderTable = () => {
    let table = [];
    for (let b = 0; b < this.state.filtered.length; ++b) {
      table.push(
        <tr
          key={b}
          onClick={this.props.menuOpen ? null : () => this.viewRecipe(b)}
        >
          <td>{this.state.filtered[b].name}</td>
          <td>{this.state.filtered[b].cookTime}</td>
        </tr>
      );
    }
    return table;
  };

  renderCards = (colnum) => {
    let col = [];
    for (let b = colnum - 1; b < this.state.filtered.length; b += 3) {
      col.push(
        <span
          key={b}
          onClick={this.props.menuOpen ? null : () => this.viewRecipe(b)}
        >
          {" "}
          <Card
            name={this.state.filtered[b].name}
            pictureURL={this.state.filtered[b].pictureURL}
          />
        </span>
      );
    }

    return col;
  };

  updateFilteredRecipes = (newFilteredList) => {
    this.setState({ filtered: newFilteredList });
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

        <div>
          {Object.keys(this.state.filtered).length === 0 ? (
            <p>No recipes found</p>
          ) : (
            <div class="row">
              <div class="col-sm-4 column-contents">{this.renderCards(1)}</div>
              <div class="col-sm-4 column-contents">{this.renderCards(2)}</div>
              <div class="col-sm-4 column-contents">{this.renderCards(3)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RecipesTable;
