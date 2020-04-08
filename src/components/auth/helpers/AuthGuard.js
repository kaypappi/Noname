import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class AuthGuard extends Component {
  render() {
    const {auth,link} = this.props;
    /* if (!auth.uid && link==='/signin' ) {
      return <Redirect to={link} />;
    } */
   if(auth.uid && link==='/'){
        return <Redirect to={`/user/${auth.uid}`} />;
    }

    return <div>{this.props.component}</div>;
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(AuthGuard);
