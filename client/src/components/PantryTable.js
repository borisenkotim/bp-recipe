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

  //renderTable -- render an HTML table displaying the rounds logged
  //by the current user and providing buttons to view/edit and delete each round.
  renderTable = () => {
  let table = [];
  for (let r = 0; r < this.props.pantry.length; ++r) {
    table.push(
      <tr key={r}>
        <td>{this.props.pantry[r].ingredient}</td>
        <td>{this.props.pantry[r].quantity}</td>
        <td><button onClick={() => this.editPantry(r)}>
              <span className="fa fa-eye"></span></button></td>
        <td><button onClick={() => this.confirmDelete(r)}>
              <span className="fa fa-trash"></span></button></td>
      </tr> 
    );
  }
  return table;
  }

  //render--render the entire rounds table with header, displaying a "No
  //Rounds Logged" message in case the table is empty.
  render() {
    return(
    <div className="padded-page">
      <h1></h1>
      <table className="table table-hover">
        <thead className="thead-light">
        <tr>
          <th>Ingredient</th>
          <th>Quantity</th>
          <th>View/Edit...</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.rounds).length === 0 ? 
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