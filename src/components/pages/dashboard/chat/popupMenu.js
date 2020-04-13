import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { API } from "../../../auth/helpers/routes";
import Menu3 from "../../../../Assets/menu3-light.svg";
import Close from "../../../../Assets/close.svg";
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
    const url = `${API.protocol}${API.host}/user/${this.props.auth.uid}`;
    return (
      <div
        ref={(node) => {
          this.node = node;
        }}
        className="notification"
      >
        <button
          className="notification-icon outline-none"
          onClick={() => {
            this.handleClick();
          }}
        >
          {this.state.popupVisible ? (
            <img src={Close} width="20" alt="" />
          ) : (
            <img src={Menu3} width="20" alt="" />
          )}
        </button>
        {this.state.popupVisible && (
          <div
            className="content bg-white font-semibold text-black text-xs menu-content"
            id="notificationTab"
          >
            <ul className="menu-options">
              <CopyToClipboard
                text={url}
                onCopy={() => {
                  this.props.copyCodeToClipboard("Link Copied!");
                }}
              >
                <li className="">Copy Link</li>
              </CopyToClipboard>

              <li onClick={this.props.openAvatar}>Edit Avatar</li>
              {!this.props.auth.isAnonymous ? (
                <li className="li-bottom" onClick={this.props.signout}>
                  Sign Out
                </li>
              ) : (
                <li className="li-bottom">
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
