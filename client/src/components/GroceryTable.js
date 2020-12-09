import React from 'react';
import AppMode from '../AppMode.js';

class GroceryTable extends React.Component {

  confirmDelete = (id) => {
    this.props.setDeleteId(id);
  }

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
          {Object.keys(this.props.ingredients).length === 0 ? 
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