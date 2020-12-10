import React from "react";
import PantryTable from "./PantryTable.js";
import GroceryTable from "./GroceryTable.js";
import PantryForm from "./PantryForm.js";
import AppMode from "../AppMode.js";
import FloatingButton from "./FloatingButton.js";
class PantryPage extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      pantry: [],
      groceryList: [],
      deleteId: "",
      editId: "",
      groceryDeleteId: ""
    };
  }

  fetchPantry = async (redirectPage=null) => {
    let url = "/pantry/" + this.props.user.id;
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
      { pantry: JSON.parse(body) },
      
    );
    if (redirectPage){
      this.props.changeMode(redirectPage)
    }
  };

  fetchGroceryList = async (redirectPage=null) => {
    let url = "/groceryList/" + this.props.user.id;
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
      { groceryList: JSON.parse(body) },
      
    );
    if (redirectPage){
      this.props.changeMode(redirectPage)
    }
  };

  componentDidMount() {
    this.fetchPantry(AppMode.PANTRY);
    this.fetchGroceryList(AppMode.PANTRY);
  }

    //setDeleteId -- Capture in this.state.deleteId the unique id of the item
  //the user is considering deleting.
  setDeleteId = (val) => {
    this.setState({ deleteId: val });
    this.deleteIngredient();
  };
  setDeleteId2 = (val) => {
    this.setState({ groceryDeleteId: val });
    this.deleteGrocery();
  };
  //setEditId -- Capture in this.state.editId the unique id of the item
  //the user is considering editing.
  setEditId = (val) => {
    this.setState({ editId: val });
  };

  editIngredient = async (newData, editId=this.state.editId, redirectPage=null) => {
    let url =
      "/pantry/" +
      this.props.user.id +
      "/" +
      this.state.pantry[editId]._id;
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
      this.fetchPantry(redirectPage);
    }
  };

  deleteIngredient = async (deleteId=this.state.deleteId) => {
    let url =
      "/pantry/" +
      this.props.user.id +
      "/" +
      this.state.pantry[deleteId]._id;
    let res = await fetch(url, { method: "DELETE" });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to delete recipe from database: " +
          msg
      );
    }
    this.fetchPantry(AppMode.PANTRY); 
  };

  deleteGrocery = async (deleteId=this.state.groceryDeleteId) => {
    let url =
      "/groceryList/" +
      this.props.user.id +
      "/" +
      this.state.groceryList[deleteId]._id;
    let res = await fetch(url, { method: "DELETE" });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to delete recipe from database: " +
          msg
      );
    }
    this.fetchGroceryList(AppMode.PANTRY); 
  };


  addIngredient = async (newData) => {

    this.state.pantry.push(newData);
    
    const url = "/pantry/" + this.props.user.id;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.state.pantry),
    });
    const msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to add new recipe to database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchPantry(AppMode.PANTRY);
    }
  };

  addGrocery = async (newData) => {
    const url = "/groceryList/" + this.props.user.id;
    this.state.groceryList.push(newData);
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.state.groceryList),
    });
    const msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to add new recipe to database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchPantry(AppMode.PANTRY);
    }
  };
  render() {
    switch (this.props.mode)
    {
      case AppMode.PANTRY:
        return (
        <React.Fragment>
        <div className="paddedPage center">
          <h1 align="center">Grocery Management</h1>
          <h2 align="center">Pantry</h2>
          <PantryTable 
            pantry={this.state.pantry} 
            changeMode={this.props.changeMode}
            setEditId={this.setEditId}
            setDeleteId={this.setDeleteId}
            savePantry={this.editIngredient}
            menuOpen={this.props.menuOpen}
            />
          <div className="floatbtn-location">
              <FloatingButton
                handleClick={() =>
                  this.props.changeMode(AppMode.PANTRY_ADDINGREDIENT)
                }
                icon={"fa fa-plus"}
              />
          </div>
        <h2 align="center">Groceries</h2>
        <button onClick={() => this.props.changeMode(AppMode.GROCERY_ADDINGREDIENT)}>
              Add to Shopping Cart</button>
        <GroceryTable 
            shopCart={this.state.groceryList} 
            changeMode={this.props.changeMode}
            setEditId={this.setEditId}
            setDeleteId={this.setDeleteId2}
            saveGrocery={this.addGrocery}
            menuOpen={this.props.menuOpen}
            />
          <div className="floatbtn-location">
              <FloatingButton
                handleClick={() =>
                  this.props.changeMode(AppMode.PANTRY_ADDINGREDIENT)
                }
                icon={"fa fa-plus"}
              />
          </div>
      </div>
      </React.Fragment>
      );
      case AppMode.PANTRY_ADDINGREDIENT:
        return (
          <PantryForm mode={this.props.mode} savePantry={this.addIngredient} />
        );
        case AppMode.GROCERY_ADDINGREDIENT:
          return (
            <PantryForm mode={this.props.mode} savePantry={this.addGrocery} />
          );
      case AppMode.PANTRY_EDITINGREDIENT:
        return (
          <PantryForm mode={this.props.mode} savePantry={this.editIngredient} pantryData={this.state.pantry[this.state.editId]} />
        );
  }
}
}

export default PantryPage;
