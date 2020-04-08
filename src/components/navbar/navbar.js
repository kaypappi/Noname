import React, { Component } from "react";
import { Link } from "react-router-dom";
import {connect} from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'


class Navbar extends Component {
  render() {
    const links=this.props.auth.uid ? <SignedInLinks/>: <SignedOutLinks/>
    return (
      <div className="navbar-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {links}
          </div>
        </nav>
      </div>
    );
  }
}


const mapStateToProps=(state)=>{
  return{
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(Navbar)
