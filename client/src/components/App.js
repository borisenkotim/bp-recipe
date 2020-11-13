import React from "react";
import NavBar from "./NavBar.js";
import LoginPage from "./LoginPage.js";
import Recipes from "./Recipes.js";
import PantryPage from "./PantryPage.js";
import AppMode from "./../AppMode.js";

const modeTitle = {};
modeTitle[AppMode.LOGIN] = "Welcome to Your Library";
modeTitle[AppMode.RECIPES] = "Your Recipes";
modeTitle[AppMode.RECIPES_ADDRECIPE] = "Add New Recipe";
modeTitle[AppMode.RECIPES_EDITRECIPE] = "Edit Recipe";
modeTitle[AppMode.REVIEWS] = "Reviews";

const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.RECIPES] = Recipes;
modeToPage[AppMode.RECIPES_ADDRECIPE] = Recipes;
modeToPage[AppMode.RECIPES_EDITRECIPE] = Recipes;
modeToPage[AppMode.RECIPES_VIEWRECIPE] = Recipes;
modeToPage[AppMode.PANTRY] = PantryPage;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: AppMode.LOGIN,
      menuOpen: false,
      user: "",
      showAbout: false,
      authenticated: false,
      showEdit: false
    };
  }

  handleChangeMode = newMode => {
    this.setState({ mode: newMode });
  };

  openMenu = () => {
    this.setState({ menuOpen: true });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  toggleMenuOpen = () => {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  };

  setUser = (userObj) => {
    this.setState({ user: userObj });
  };

  showEditDialog = () => {
    this.setState({showEditUser: true});
  };

   //setAuthenticated -- Given auth (true or false), update authentication state.
   setAuthenticated = (auth) => {
    this.setState({authenticated: auth});
  }

  handleNewEditChange = (event) =>
  {
    let userData = this.state.user;
    userData[event.target.name] = event.target.value;
    this.setState({user: userData});
}

  //When App component mounts, add a window-level click handler to close the
  //side menu if it is open. This event should fire only if no other lower-level
  //events intercept the click.
  componentDidMount() {
    window.addEventListener("click", this.handleClick);

    if (!this.state.authenticated) {
      //Use /auth/test route to (re)-test authentication and obtain user data
      fetch("/auth/test")
        .then(response => response.json())
        .then(obj => {
          if (obj.isAuthenticated) {
            let data = JSON.parse(localStorage.getItem("yourRecipeUserData"));
            if (data == null) {
              data = {}; //create empty database (localStorage)
            }

            if (!data.hasOwnProperty(obj.user.id)) {
              //create new user with this id in database (localStorage)
              data[obj.user.id] = {
                accountInfo: {
                  provider: obj.user.provider,
                  password: "",
                  securityQuestion: "",
                  securityAnswer: ""
                },

                Recipes: {},
              };

              //Commit to localStorage:
              localStorage.setItem("yourLibraryUserData", JSON.stringify(data));
            }

            //Update current user
            this.setState({
              authenticated: true,
              user: obj.user,
              mode: AppMode.RECIPES //We're authenticated so can get into the app.
            });
          }
        });
    }
  }

  //We remove the event listener when the component
  //unmounts. This is a best practice.
  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }

  //When the user clicks anywhere on the app and the menu is open, close it.
  //This function takes advantage of event bubbling.
  handleClick = event => {
    if (this.state.menuOpen) {
      this.closeMenu();
    }
    event.stopPropagation();
  };

  toggleAbout = () => {
    this.setState(prevState => ({ showAbout: !prevState.showAbout }));
  };

  handleEditAccount = async(event) => {
    event.preventDefault();
    //Initialize user account
    let userData = {
        displayName: this.state.user['displayName'],
        securityQuestion: this.state.user['securityQuestion'],
        securityAnswer: this.state.user['securityAnswer']
    };

    const url = '/users/' + this.state.user['id'];
    const res = await fetch(url, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'PUT',
      userId: this.state.user['id'],
      body: JSON.stringify(userData)});
    //Commit to local storage
    if (res.status !== 200)
    {
        alert('userNotedited');
    }
    this.setState({showEditDialog: false});
  }

  renderEditAccountDialog = () => {
    return (
      <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <b>Edit Account</b>
                <button
                  className="close-modal-button"
                  onClick={() => {
                    this.setState({ showEditUser: false });
                  }}
                >
                  &times;
                </button>
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleEditAccount}>
                <label>
                  Email:
                  <input
                    className="form-control form-text"
                    name="id"
                    type="email"
                    size="35"
                    placeholder="Enter Email Address"
                    pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                    readOnly = {true}
                    required={true}
                    value={this.state.user["id"]}
                    onChange={this.handleNewEditChange}
                  />
                </label>
                <label>
                  DisplayName:
                  <textarea
                    className="form-control form-text"
                    name="displayName"
                    size="35"
                    placeholder="Security Question"
                    rows="2"
                    cols="35"
                    maxLength="100"
                    required={true}
                    value={this.state.user["displayName"]}
                    onChange={this.handleNewEditChange}
                  />
                </label>
                <label>
                  Security Question:
                  <textarea
                    className="form-control form-text"
                    name="securityQuestion"
                    size="35"
                    placeholder="Security Question"
                    rows="2"
                    cols="35"
                    maxLength="100"
                    required={true}
                    readOnly = {this.state.user['authStrategy'] != 'local' ? true: false}
                    value={this.state.user["securityQuestion"]}
                    onChange={this.handleNewEditChange}
                  />
                </label>
                <label>
                  Answer to Security Question:
                  <textarea
                    className="form-control form-text"
                    name="securityAnswer"
                    type="text"
                    placeholder="Answer"
                    rows="2"
                    cols="35"
                    maxLength="100"
                    required={true}
                    readOnly = {this.state.user['authStrategy'] != 'local' ? true: false}
                    value={this.state.user["securityAnswer"]}
                    onChange={this.handleNewEditChange}
                  />
                </label>
                <button
                  role="submit"
                  className="loginBtn btn btn-primary
                  btn-block btncolortheme"
                >
                  <span className="fa fa-user-plus"></span>&nbsp;Edit Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderAbout = () => {
    return (
      <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <b>About Your Recipe App</b>
                <button
                  className="close-modal-button"
                  onClick={this.toggleAbout}
                >
                  &times;
                </button>
              </h3>
            </div>
            <div className="modal-body ">
              <center>
                <img
                  src={require("./../styles/pancakes.jpg")}
                  height="280px"
                  width="370px"
                  className="aboutBody"
                />
                <h3>Store Your Recipes Online!</h3>
                <p>
                  <em>
                    Version 1 (Live), Build 20.6.2018 <br />
                    &copy; 2020 Recipe Team. All rights reserved.
                  </em>
                </p>
              </center>
              <p>
                <b>Your Recipe App supports</b>
              </p>
              <ul className="yourRecipesSupports">
                <li>Adding and removing recipes in your personal cook book</li>
                <li>Managing your groceries</li>
              </ul>
              <br/>
              <p>
                Your Recipe App was first developed by The Recipe Team, which is
                composed of two teams. They are doing this for a CptS 489 project.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="loginBtn btn btn-primary btn-color-theme"
                onClick={this.toggleAbout}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const ModePage = modeToPage[this.state.mode];
    return (
      <div onClick={this.handleClick}>
        {this.state.mode != AppMode.LOGIN &&
          <NavBar
          title={modeTitle[this.state.mode]}
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          user={this.state.user}
          menuOpen={this.state.menuOpen}
          toggleMenuOpen={this.toggleMenuOpen}
          showAbout={this.toggleAbout}
          showEditDialog={this.showEditDialog}
        />}
        <ModePage
          menuOpen={this.state.menuOpen}
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          setAuthenticated={this.setAuthenticated}
          user={this.state.user}
          setUser={this.setUser}
        />
        {this.state.showAbout ? this.renderAbout() : null}
        {this.state.showEditUser ? this.renderEditAccountDialog(): null}
      </div>
    );
  }
}

export default App;
