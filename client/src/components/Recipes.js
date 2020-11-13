import React from "react";
import FloatingButton from "./FloatingButton.js";
import AppMode from "../AppMode.js";
import RecipesTable from "./RecipesTable.js";
import RecipeForm from "./RecipeForm.js";
import ViewRecipePage from "./ViewRecipePage.js"

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      deleteId: "",
      editId: "",
      viewId: ""
    };
  }

  fetchRecipes = async (redirectPage=null) => {
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
      
    );
    if (redirectPage){
      this.props.changeMode(redirectPage)
    }
  };

  componentDidMount() {
    this.fetchRecipes(AppMode.RECIPES);
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

  setViewId = (val) => {
    this.setState({viewId: val});
  }

  editRecipe = async (newData, editId=this.state.editId, redirectPage=null) => {
    let url =
      "/recipes/" +
      this.props.user.id +
      "/" +
      this.state.recipes[editId]._id;
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
      this.fetchRecipes(redirectPage);
    }
  };

  deleteRecipe = async (deleteId=this.state.deleteId) => {
    let url =
      "/recipes/" +
      this.props.user.id +
      "/" +
      this.state.recipes[deleteId]._id;
    let res = await fetch(url, { method: "DELETE" });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to delete recipe from database: " +
          msg
      );
    }
    this.fetchRecipes(AppMode.RECIPES); 
  };

  addRecipe = async (newData) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    newData.dateAdded = today;
    
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
      this.fetchRecipes(AppMode.RECIPES);
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
              setViewId={this.setViewId}
              saveRecipe={this.editRecipe}
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
      case AppMode.RECIPES_VIEWRECIPE:
        return ( 
          <ViewRecipePage
            mode={this.props.mode}
            id={this.state.viewId}
            data={this.state.recipes[this.state.viewId]}
            changeMode={this.props.changeMode}
            saveRecipe={this.editRecipe}
            deleteRecipe={this.deleteRecipe}
          />
        );
    }
  }
}

export default Recipes;
