import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu3 from "../../../../Assets/menu3-light.svg";
import SignupModal from "../signupModal";
import "./popupMenu.css";

class NotificationTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupVisible: false,
      display: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  openDropdown = () => {
    this.setState({
      display: !this.state.display,
    });
  };

  handleClick = () => {
    this.setState({
      newNotifications: 0,
    });
    if (!this.state.popupVisible) {
      // attach/remove event handler
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      popupVisible: !prevState.popupVisible,
    }));
  };

  handleOutsideClick = (e) => {
    // ignore clicks on the component itself
    if (this.node) {
      if (this.node.contains(e.target)) {
        return;
      }
    }

    this.handleClick();
  };

  render() {
    return (
      <div
        ref={(node) => {
          this.node = node;
        }}
        className="notification"
      >
        <button
          className={`"notification-icon" ${this.props.classes}`}
          onClick={() => {
            this.handleClick();
          }}
        >
          <img src={Menu3} width="20" alt="" />
        </button>
        {this.state.popupVisible && (
          <div
            className="content bg-white font-semibold text-black text-xs menu-content"
            id="notificationTab"
          >
            <ul className="menu-options">
              <Link to="/">
                <li>Home</li>
              </Link>

              <li onClick={this.props.openAvatar}>Edit Avatar</li>
              {!this.props.auth.isAnonymous ? (
                <li onClick={this.props.signout}>Sign Out</li>
              ) : (
                <li>
                  <SignupModal />
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default NotificationTab;
