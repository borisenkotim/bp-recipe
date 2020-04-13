import React from "react";
import AppMode from "../AppMode.js";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { NavItem } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import {NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

class NavBar extends React.Component {

  render() {
    return (

      <Nav className="navbar-base">
        &nbsp;
        <Nav.Item className="navbar-brand-custom">
          <span className="modebar-icon fa fa-th-list"></span>
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
                  src={this.props.user.profileImageUrl}
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
