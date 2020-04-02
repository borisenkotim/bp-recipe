import React from "react";
import AppMode from "../AppMode.js";

class SideMenu extends React.Component {
  //renderModeItems -- Renders correct subset of mode menu items based on
  //current mode, which is stored in this.prop.mode. Uses switch statement to
  //determine mode.
  renderModeMenuItems = () => {
    switch (this.props.mode) {
      case AppMode.BOOKS:
        return (
          <div>
            <a
              className="sidemenu-item"
              onClick={() => this.props.changeMode(AppMode.BOOKS_ADDBOOK)}
            >
              <span className="fa fa-plus"></span>&nbsp;Add Book
            </a>
          </div>
        );
        break;
      case AppMode.REVIEWS:
        return <div></div>;
      default:
        return null;
    }
  };

  render() {
    return (
      <div
        className={
          "sidemenu " +
          (this.props.menuOpen ? "sidemenu-open" : "sidemenu-closed")
        }
      >
        {/* SIDE MENU TITLE */}
        <div className="sidemenu-title">
          <div className="sidemenu-title">
            <img src={this.props.user.profileImageUrl} height="50" width="50" />
            <span className="sidemenu-userID">
              &nbsp;{this.props.user.displayName}
            </span>
          </div>
          <span className="sidemenu-userID">&nbsp;{this.props.userId}</span>
        </div>
        {/* MENU CONTENT */}
        {/*Mode-based menu items */}
        {this.renderModeMenuItems()}
        {/* Always-there menu items */}
        <a className="sidemenu-item" onClick={this.props.showAbout}>
          <span className="fa fa-info-circle"></span>&nbsp;About
        </a>
        <a
          className="sidemenu-item"
          onClick={() => this.props.changeMode(AppMode.LOGIN)}
        >
          <span className="fa fa-sign-out"></span>&nbsp;Log Out
        </a>
      </div>
    );
  }
}

export default SideMenu;
