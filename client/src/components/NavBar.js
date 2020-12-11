import React from "react";
import AppMode from "../AppMode.js";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { NavItem } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import {NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

const modeToPage = {};
modeToPage[AppMode.RECIPES_ADDRECIPE] = AppMode.RECIPES;
modeToPage[AppMode.RECIPES_EDITRECIPE] = AppMode.RECIPES;
modeToPage[AppMode.RECIPES_VIEWRECIPE] = AppMode.RECIPES;
modeToPage[AppMode.PANTRY_EDITINGREDIENT] = AppMode.PANTRY;
modeToPage[AppMode.PANTRY_ADDINGREDIENT] = AppMode.PANTRY;
modeToPage[AppMode.GROCERY_ADDINGREDIENT] = AppMode.PANTRY;

class NavBar extends React.Component {

  render() {
    var addOrEditMode = this.props.mode === AppMode.RECIPES_ADDRECIPE || this.props.mode === AppMode.RECIPES_EDITRECIPE || this.props.mode === AppMode.RECIPES_VIEWRECIPE 
    || this.props.mode === AppMode.PANTRY_ADDINGREDIENT || this.props.mode === AppMode.GROCERY_ADDINGREDIENT || this.props.mode === AppMode.PANTRY_EDITINGREDIENT

    return (
      <Nav className="navbar-base">
        &nbsp;
        <Nav.Item className="navbar-brand-custom">
            <span onClick={addOrEditMode ? () => this.props.changeMode(modeToPage[this.props.mode]) : null}
            className={addOrEditMode ? "modebar-icon fa fa-arrow-left favorited" : "modebar-icon fa fa-cutlery"}
            disabled={!addOrEditMode} style={{marginLeft: "8px", marginTop:"3px"}}/>
          &nbsp;&nbsp;&nbsp;My Recipe App
        </Nav.Item>
          <div className="navbar-items ml-auto">
            <Nav.Item>
              <Nav.Link
                className={
                  this.props.mode == AppMode.RECIPES
                    ? "navlink navlink-selected"
                    : "navlink"
                }
                onClick={() => this.props.changeMode(AppMode.RECIPES)}
              >
                Recipe List
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                id="groceryNav"
                onClick={() => this.props.changeMode(AppMode.PANTRY)}
                className={
                  this.props.mode == AppMode.PANTRY
                    ? "navlink navlink-grocery navlink-selected"
                    : "navlink navlink-grocery"
                }
              >
                Groccery Management
              </Nav.Link>
            </Nav.Item>
            <Dropdown as={NavItem}>
              <Dropdown.Toggle as={NavItem}>
                <img
                  src={this.props.user.profileImageURL}
                  height="40"
                  width="40"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  Logged In as <b>{this.props.user.displayName}</b>
                </Dropdown.Item>
                <Dropdown.Item onClick={this.props.showAbout}>
                  About Recipe App
                </Dropdown.Item>
                <Dropdown.Item onClick={this.props.showEditDialog}>
                  Edit User Information
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => this.props.changeMode(AppMode.LOGIN)}
                >
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
      </Nav>
    );
  }
}

export default NavBar;
