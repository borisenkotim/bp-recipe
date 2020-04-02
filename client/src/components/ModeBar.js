import React from "react";
import AppMode from "../AppMode.js";

class ModeBar extends React.Component {
  handleModeBtnClick = newMode => {
    if (this.props.mode != newMode) {
      this.props.changeMode(newMode);
    }
  };

  render() {
    return (
      <div
        className={
          "modebar" +
          (this.props.mode === AppMode.LOGIN ? " invisible" : " visible") +
          (this.props.mode === AppMode.BOOKS_ADDBOOK ||
          this.props.mode === AppMode.BOOKS_EDITBOOK
            ? " disabledButton"
            : "")
        }
        id="bottomBar"
      >
        <a
          className={
            "modebar-btn" +
            (this.props.mode === AppMode.BOOKS ? " modebar-item-selected" : "")
          }
          onClick={
            this.props.menuOpen
              ? null
              : () => this.handleModeBtnClick(AppMode.BOOKS)
          }
        >
          <span className="modebar-icon fa fa-th-list"></span>
          <span className="modebar-text">Books</span>
        </a>
        <a
          className={
            "modebar-btn" +
            (this.props.mode === AppMode.REVIEWS
              ? " modebar-item-selected"
              : "")
          }
          onClick={
            this.props.menuOpen
              ? null
              : () => this.handleModeBtnClick(AppMode.REVIEWS)
          }
        >
          <span className="modebar-icon fa fa-book"></span>
          <span className="modebar-text">Reviews</span>
        </a>
      </div>
    );
  }
}

export default ModeBar;
