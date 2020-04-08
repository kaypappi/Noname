import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

class SignedInLinks extends Component {
  render() {
    return (
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link to={"/dashboard"} className="nav-link" href="#">
              Dashboard <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li onClick={this.props.signout} className="nav-item">
            <a className="nav-link" href="#" tabindex="-1" aria-disabled="true">
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signout: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(SignedInLinks);
