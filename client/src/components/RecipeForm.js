import React from "react";
import AppMode from "../AppMode.js";

//bookForm -- this component presents a controlled form through which the user
//can enter a new book or edit an existing book.
class RecipeForm extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.mode === AppMode.BOOKS_ADDBOOK) {
      this.state = {
        bookName: "",
        author: "",
        genere: "Realistic Fiction",
        pages: null,
        faIcon: "fa fa-save",
        btnLabel: "Save Book Data"
      };
    } else {
      this.state = this.props.startData;
      this.state.faIcon = "fa fa-edit";
      this.state.btnLabel = "Update Book Data";
    }
  }

  handleChange = event => {
    const name = event.target.name;
    console.log("event.target.select");
    console.log(event.target.select);
    this.setState({ [name]: event.target.value });
  };

  //handleSubmit -- When the user clicks on the button to save/update the
  //book, start the spinner and invoke the parent component's savebook
  //method to do the actual work. Note that savebook is set to the correct
  //parent method based on whether the user is logging a new book or editing
  //an existing book.
  handleSubmit = event => {
    //start spinner
    this.setState({
      faIcon: "fa fa-spin fa-spinner",
      btnLabel:
        this.props.mode === AppMode.BOOKS_ADDBOOK ? "Saving..." : "Updating..."
    });
    //Prepare current book data to be saved
    let bookData = this.state;
    delete bookData.faIcon;
    delete bookData.btnLabel;
    //call savebook on 1 second delay to show spinning icon
    setTimeout(this.props.saveBook, 1000, bookData);
    event.preventDefault();
  };

  //render -- renders the form to enter book data.
  render() {
    return (
      <div className="paddedPage">
        <form onSubmit={this.handleSubmit}>
          <p></p>
          <center>
            <label htmlFor="bookName">
              Book Name:
              <input
              value={this.state.bookName}
                name="bookName"
                id="bookName"
                class="form-control form-center "
                type="text"
                required
                onChange={this.handleChange}
              />
            </label>
            &nbsp;
            <label htmlFor="author">
              Author:
              <input
              value={this.state.author}
                name="author"
                id="author"
                class="form-control form-center "
                type="text"
                required
                onChange={this.handleChange}
              />
            </label>
            &nbsp;
            <label htmlFor="genere">
              Genere:
              <select
              value={this.state.genere}
                name="genere"
                id="genere"
                class="form-control form-center "
                required
                onChange={this.handleChange}
              >
                <option value="Realistic Fiction">Realistic Fiction</option>
                <option value="Non Fiction">Non Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Other">Other</option>
              </select>
            </label>
            &nbsp;
            <label htmlFor="numPages">
              Number of Pages:
              <input
              value={this.state.pages}
                name="pages"
                ref={this.pagesRef}
                id="numPages"
                class="form-control form-center"
                type="number"
                min="1"
                max="1000"
                required
                onChange={this.handleChange}
              />
            </label>
            <p></p>
            <button
              id="submitBookBtn"
              type="submit"
              className="loginBtn btn btn-primary
                    btn-block btncolortheme"
              style={{ width: "230px", fontSize: "20px", zindex: 110 }}
            >
              <span className={this.state.faIcon} />
              &nbsp;{this.state.btnLabel}
            </button>
          </center>
        </form>
      </div>
    );
  }
}

export default RecipeForm;
