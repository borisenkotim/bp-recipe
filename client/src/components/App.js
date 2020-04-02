import React from "react";
import NavBar from "./NavBar.js";
import SideMenu from "./SideMenu.js";
import ModeBar from "./ModeBar.js";
import LoginPage from "./LoginPage.js";
import Recipes from "./Recipes.js";
import PantryPage from "./PantryPage.js";
import AppMode from "./../AppMode.js";

const modeTitle = {};
modeTitle[AppMode.LOGIN] = "Welcome to Your Library";
modeTitle[AppMode.RECIPES] = "Your Recipes";
modeTitle[AppMode.RECIPES_ADDBOOK] = "Add New Recipe";
modeTitle[AppMode.RECIPES_EDITBOOK] = "Edit Recipe";
modeTitle[AppMode.REVIEWS] = "Reviews";

const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.RECIPES] = Recipes;
modeToPage[AppMode.RECIPES_ADDBOOK] = Recipes;
modeToPage[AppMode.RECIPES_EDITBOOK] = Recipes;
modeToPage[AppMode.PANTRY] = PantryPage;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: AppMode.LOGIN,
      menuOpen: false,
      user: "",
      showAbout: false,
      authenticated: false
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

   //setAuthenticated -- Given auth (true or false), update authentication state.
   setAuthenticated = (auth) => {
    this.setState({authenticated: auth});
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
                  src={require("./books.jpg")}
                  height="280px"
                  width="370px"
                  className="aboutBody"
                />
                <h3>Build Your Own Personal Library!</h3>
                <p>
                  <em>
                    Version 1 (Live), Build 20.6.2018 <br />
                    &copy; 2020 Madeline Anderson. All rights reserved.
                  </em>
                </p>
              </center>
              <p>
                <b>Your Library app supports</b>
              </p>
              <ul className="yourRecipesSupports">
                <li>Adding and removing RECIPES in your personal library</li>
                <li>Viewing your library</li>
              </ul>
              <p>
                Your Library was first developed by Madeline Anderson, a
                Computer Science Major at Washington State University. She is
                currently a Junior, Developing this for CptS 489. She is an
                intern at SEL in Pullman.
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
          menuOpen={this.state.menuOpen}
          toggleMenuOpen={this.toggleMenuOpen}
        />}
        <SideMenu
          mode={this.state.mode}
          menuOpen={this.state.menuOpen}
          changeMode={this.handleChangeMode}
          user={this.state.user}
          showAbout={this.toggleAbout}
        />
        <ModeBar
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          menuOpen={this.state.menuOpen}
        />
        <ModePage
          menuOpen={this.state.menuOpen}
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          setAuthenticated={this.setAuthenticated}
          user={this.state.user}
          setUser={this.setUser}
        />
        {this.state.showAbout ? this.renderAbout() : null}
      </div>
    );
  }
}

export default App;
