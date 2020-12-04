import React from 'react';
import AppMode from '../AppMode.js';

class GroceryTable extends React.Component {

  confirmDelete = (id) => {
    this.props.setDeleteId(id);
    alert("Confirm Delete Goes here!");
  }

  //renderTable -- render an HTML table displaying the rounds logged
  //by the current user and providing buttons to view/edit and delete each round.
  renderTable = () => {
  let table = [];
  for (let r = 0; r < this.props.shopCart.length; ++r) {
    table.push(
      <tr key={r}>
        <td>{this.props.shopCart[r].ingredient}</td>
        <td>{this.props.shopCart[r].quantity}</td>
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
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.rounds).length === 0 ? 
          <tr>
          <td colSpan="5" style={{fontStyle: "italic"}}>No Items Added to the Shopping cart</td>
          </tr> : this.renderTable()
          }
        </tbody>
      </table>
    </div>
    );
  }
}

export default GroceryTable;