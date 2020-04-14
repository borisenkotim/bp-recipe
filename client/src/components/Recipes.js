import React from "react";
import FloatingButton from "./FloatingButton.js";
import AppMode from "../AppMode.js";
import RecipesTable from "./RecipesTable.js";
import RecipeForm from "./RecipeForm.js";

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      deleteId: "",
      editId: "",
    };
  }

  fetchRecipes = async () => {
    let url = "/recipes/" + this.props.user.id;
    let res = await fetch(url, { method: "GET" });
    if (res.status != 200) {
      let msg = await res.text();
      alert(
        "Sorry, there was an error obtaining books data for this user: " + msg
      );
      return;
    }
    let body = await res.json();
    this.setState(
      { recipes: JSON.parse(body) },
      this.props.changeMode(AppMode.RECIPES)
    );
  };

  componentDidMount() {
    this.fetchRecipes();
  }

  //setDeleteId -- Capture in this.state.deleteId the unique id of the item
  //the user is considering deleting.
  setDeleteId = (val) => {
    this.setState({ deleteId: val });
  };

  //setEditId -- Capture in this.state.editId the unique id of the item
  //the user is considering editing.
  setEditId = (val) => {
    this.setState({ editId: val });
  };

  editRecipe = async (newData) => {
    let url =
      "/recipes/" +
      this.props.user.id +
      "/" +
      this.state.recipes[this.state.editId]._id;
    let res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(newData),
    });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to update a recipe in the database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchRecipes();
    }
  };

  deleteRecipe = async () => {
    let url =
      "/recipes/" +
      this.props.user.id +
      "/" +
      this.state.recipes[this.state.deleteId]._id;
    let res = await fetch(url, { method: "DELETE" });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to delete recipe from database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchRecipes();
    }
  };

  addRecipe = async (newData) => {
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    newData.dateAdded = today;

    console.log('Harry look here');
    console.log('newData');
    console.log(JSON.stringify(newData));

    const url = "/recipes/" + this.props.user.id;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newData),
    });
    const msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to add new recipe to database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchRecipes();
    }
  };

  render() {
    switch (this.props.mode) {
      case AppMode.RECIPES:
        return (
          <React.Fragment>
            <RecipesTable
              recipes={this.state.recipes}
              setEditId={this.setEditId}
              setDeleteId={this.setDeleteId}
              deleteRecipe={this.deleteRecipe}
              changeMode={this.props.changeMode}
              menuOpen={this.props.menuOpen}
            />
            <div className="floatbtn-location">
              <FloatingButton
                handleClick={() =>
                  this.props.changeMode(AppMode.RECIPES_ADDRECIPE)
                }
                icon={"fa fa-plus"}
              />
            </div>
          </React.Fragment>
        );
      case AppMode.RECIPES_ADDRECIPE:
        return (
          <RecipeForm mode={this.props.mode} saveRecipe={this.addRecipe} />
        );
      case AppMode.RECIPES_EDITRECIPE:
        return (
          <RecipeForm
            mode={this.props.mode}
            startData={this.state.recipes[this.state.editId]}
            saveRecipe={this.editRecipe}
          />
        );
    }
  }
}

export default Recipes;
