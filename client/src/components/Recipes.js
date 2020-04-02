//books -- A parent component for the app's "books" mode.sidemenu-user
//Manages the books data for the current user and conditionally renders the
//appropriate books mode page based on App's mode, which is passed in as a
//prop.

import React from "react";
import FloatingButton from "./FloatingButton.js";
import AppMode from "../AppMode.js";
import RecipesTable from "./RecipesTable.js";
import RecipeForm from "./RecipeForm.js";

class Recipes extends React.Component {
  //Initialize a books object based on local storage
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      deleteId: "",
      editId: ""
    };
  }

  fetchBooks = async () => {
    let url = "/books/" + this.props.user.id;
    let res = await fetch(url, {method: 'GET'});
    if (res.status != 200) {
        let msg = await res.text();
        alert("Sorry, there was an error obtaining books data for this user: " + msg);
        return;
    } 
    let body = await res.json();
    this.setState({books: JSON.parse(body)}, this.props.changeMode(AppMode.BOOKS));
}

  componentDidMount() {
    this.fetchBooks();
  }

  //setDeleteId -- Capture in this.state.deleteId the unique id of the item
  //the user is considering deleting.
  setDeleteId = val => {
    this.setState({ deleteId: val });
  };

  //setEditId -- Capture in this.state.editId the unique id of the item
  //the user is considering editing.
  setEditId = val => {
    this.setState({ editId: val });
  };

  //editbook -- Given an object newData containing updated data on an
  //existing book, update the current user's book uniquely identified by
  //this.state.editId, commit to local storage, reset editId to empty and
  //toggle the mode back to AppMode.bookS since the user is done editing the
  //book.
  editBook = async newData => {
    let url =
      "/books/" +
      this.props.user.id +
      "/" +
      this.state.books[this.state.editId]._id;
    let res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify(newData)
    });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to update a book in the database: " +
          msg
      );
    } else {
      //Push update into component state:
      this.fetchBooks();
    }
  };

  //deleteBook -- Delete the current user's book uniquely identified by
  //this.state.deleteId, commit to local storage, and reset deleteId to empty.
  deleteBook = async () => {
    let url =
      "/books/" +
      this.props.user.id +
      "/" +
      this.state.books[this.state.deleteId]._id;
    let res = await fetch(url, { method: "DELETE" });
    let msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to delete book from database: " + msg
      );
    } else {
      //Push update into component state:
      this.fetchBooks();
    }
  };

  //addbook -- Given an object newData containing a new book, add the book
  //to the current user's list of books, commit to local storage, and toggle
  //the mode back to AppMode.bookS since the user is done adding a book.
  addBook = async newData => {
    const url = "/books/" + this.props.user.id;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(newData)
    });
    const msg = await res.text();
    if (res.status != 200) {
      alert(
        "An error occurred when attempting to add new book to database: " + msg
      );
    } else {
      //Push update into component state:
      this.fetchBooks();
    }
  };

  //render -- Conditionally render the books mode page as either the books
  //table, the books form set to obtain a new book, or the books form set
  //to edit an existing book.
  render() {
    switch (this.props.mode) {
      case AppMode.BOOKS:
        return (
          <React.Fragment>
            <RecipesTable
              books={this.state.books}
              setEditId={this.setEditId}
              setDeleteId={this.setDeleteId}
              deleteBook={this.deleteBook}
              changeMode={this.props.changeMode}
              menuOpen={this.props.menuOpen}
            />
            <FloatingButton
              handleClick={() => this.props.changeMode(AppMode.BOOKS_ADDBOOK)}
              menuOpen={this.props.menuOpen}
              icon={"fa fa-plus"}
            />
          </React.Fragment>
        );
      case AppMode.BOOKS_ADDBOOK:
        return <RecipeForm mode={this.props.mode} saveBook={this.addBook} />;
      case AppMode.BOOKS_EDITBOOK:
        return (
          <RecipeForm
            mode={this.props.mode}
            startData={this.state.books[this.state.editId]}
            saveBook={this.editBook}
          />
        );
    }
  }
}

export default Recipes;
