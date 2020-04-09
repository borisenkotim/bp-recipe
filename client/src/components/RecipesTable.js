import React from "react";
import "../styles/modal.css";
import AppMode from "../AppMode.js";

class RecipesTable extends React.Component {
  constructor(props) {
    super(props);
    //confirmDelete state variable determines whether to show or hide the
    //confirm delete dialog box
    this.state = { confirmDelete: false };
  }

  //editbook -- Triggered when the user clicks the edit button for a given
  //book. The id param is the unique property that identifies the book.
  //Set the state variable representing the id of the book to be edited and
  //then switch to the bookS_EDITbook mode to allow the user to edit the
  //chosen book.
  editBook = id => {
    this.props.setEditId(id);
    this.props.changeMode(AppMode.BOOKS_EDITBOOK);
  };

  //confirmDelete -- Triggered when the user clicks on the delete button
  //associated with a given book. The id param is the unique property that
  //identifies the book. Set the state variable representing the id
  //of the item to be deleted and set the confirmDelete state variable to true
  //to force a re-render with the confirm delete modal dialog box showing.
  confirmDelete = id => {
    this.props.setDeleteId(id);
    this.setState({ confirmDelete: true });
  };

  //doDelete -- Triggered when the user clicks on the "Yes Delete" button in
  //the confirm delete dialog box. Call upon parent component's deletebook to
  //to actually performt he deletion of the book currently flagged for
  //deletion and toggle the confirmDelete state variable to hide the confirm
  //dialog box.
  doDelete = () => {
    this.props.deleteBook();
    this.setState({ confirmDelete: false });
  };

  //cancelDelete -- Triggered when the user chooses to cancel a delete
  //operation. We just need to update state to toggle confirmDelete to false
  cancelDelete = () => {
    this.props.setDeleteId("");
    this.setState({ confirmDelete: false });
  };

  // renderConfirmDeleteDialog: presents user with dialog to confirm deletion
  // of book. Credit: https://getbootstrap.com/docs/4.0/components/modal/
  renderConfirmDeleteDialog = () => {
    return (
      <div className="modal" role="dialog">
        <div className="modal-content">
          <div className="modal-header">
            <p className="modal-title">Confirm Book Deletion</p>
            <button className="close-modal-button" onClick={this.cancelDelete}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <center>
              <h4>Are you sure that you want to delete this book?</h4>
            </center>
            <div className="modal-footer">
              <button
                className="loginBtn btn btn-primary btn-color-scheme"
                onClick={this.doDelete}
              >
                YES
              </button>
              <button
                className="loginBtn btn btn-secondary"
                onClick={this.cancelDelete}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //renderTable -- render an HTML table displaying the books logged
  //by the current user and providing buttons to view/edit and delete each book.
  renderTable = () => {
    let table = [];
    for (let b = 0; b < this.props.books.length; ++b) {
      table.push(
        <tr key={b}>
          <td>{this.props.books[b].bookName}</td>
          <td>{this.props.books[b].author}</td>
          <td>{this.props.books[b].genere}</td>
          <td>{this.props.books[b].pages}</td>
          <td>
            <button
              onClick={this.props.menuOpen ? null : () => this.editBook(b)}
            >
              <span className="fa fa-binoculars"></span>
            </button>
          </td>
          <td>
            <button
              onClick={this.props.menuOpen ? null : () => this.confirmDelete(b)}
            >
              <span className="fa fa-trash"></span>
            </button>
          </td>
        </tr>
      );
    }
    return table;
  };

  //render--render the entire books table with header, displaying a "No
  //books Logged" message in case the table is empty.
  render() {
    return (
      <div className="paddedPage">
        <center>
          <h1>Your Library</h1>
        </center>

        <table className="table table-hover booksTable">
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Author</th>
              <th scope="col">Genere</th>
              <th scope="col">Pages</th>
              <th scope="col">View/Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.books).length === 0 ? (
              <tr>
                <td colSpan="6" style={{ fontStyle: "italic" }}>
                  No data recorded
                </td>
              </tr>
            ) : (
              this.renderTable()
            )}
          </tbody>
        </table>
        {this.state.confirmDelete ? this.renderConfirmDeleteDialog() : null}
      </div>
    );
  }
}

export default RecipesTable;
