import React from "react";
import PantryTable from "./PantryTable.js";
import GroceryTable from "./GroceryTable.js";
class PantryPage extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      pantry: [],
      groceryList: [],
      deleteId: "",
      editId: ""
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
      { recipes: JSON.parse(body) },
      
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
  };

  //setEditId -- Capture in this.state.editId the unique id of the item
  //the user is considering editing.
  setEditId = (val) => {
    this.setState({ editId: val });
  };
  render() {
    return (
      <div className="paddedPage center">
        <h1 align="center">Grocery Management</h1>
        <h2 align="center">Pantry</h2>
        <PantryTable />
        <h2 align="center">Groceries</h2>
        <GroceryTable />
      </div>
    );
  }
}

export default PantryPage;
