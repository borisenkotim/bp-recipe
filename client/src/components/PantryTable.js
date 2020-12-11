import React from 'react';
import AppMode from '../AppMode.js';

class PantryTable extends React.Component {

  editPantry = (id) => {
    this.props.setEditId(id);
    this.props.changeMode(AppMode.PANTRY_EDITINGREDIENT);
  }
  confirmDelete = (id) => {
    this.props.setDeleteId(id);
  }
  renderTable = () => {
  let table = [];
  for (let r = 0; r < this.props.pantry.length; ++r) {
    table.push(
      <tr id={"tableRow-"+ r}key={r}>
        <td>{this.props.pantry[r].name}</td>
    <td>{this.props.pantry[r].quantity}{this.props.pantry[r].unit}</td>
        <td><button id={"button2-"+r}onClick={() => this.editPantry(r)}>
              <span className="fa fa-eye"></span></button></td>
        <td><button id={"button3-"+r}onClick={() => this.confirmDelete(r)}>
              <span className="fa fa-trash"></span></button></td>
      </tr> 
    );
  }
  return table;
  }

  render() {
    return(
    <div id="pantryTablePage" className="padded-page">
      <h1></h1>
      <table id="pantryTable" className="table table-hover">
        <thead className="thead-light">
        <tr>
          <th>Ingredient</th>
          <th>Quantity</th>
          <th>View/Edit...</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.pantry).length === 0 ? 
          <tr>
          <td colSpan="5" style={{fontStyle: "italic"}}>No Ingredients Added</td>
          </tr> : this.renderTable()
          }
        </tbody>
      </table>
    </div>
    );
  }
}

export default PantryTable;