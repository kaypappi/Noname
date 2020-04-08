import React, { Component } from "react";
import {Link} from 'react-router-dom'

export default class SignedOutLinks extends Component {
  render() {
    return (
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={'/signin'} className="nav-link" href="#">
              Sign In
            </Link>
          </li>
          <li className="nav-item">
            <Link to={'/signup'} className="nav-link" href="#">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
