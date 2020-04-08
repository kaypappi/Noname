import React, { Component } from "react";
import "./SignIn.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import paint from "../../Assets/Rectangle.png";
import anon from "../../Assets/ANONymous.png";
import Input from "../extras/Input";
import { signIn } from "../../store/actions/authActions";

class SignIn extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = e => {
    const field = e.target.name;
    this.setState({
      [field]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.signin(this.state);
  };

  updateUrl=(uid)=>{
    this.props.history.push(`/user/${uid}`)
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps.auth.uid!==this.props.auth.uid){
      this.updateUrl(this.props.auth.uid)
    }
  }
  render() {
    return (
      <div className="signin-wrapper">
        <div className="signin-left">
          <img src={paint} alt="" className="paint" />
        </div>
        <div className="signin-right">
          <div className="form-holder">
            <img src={anon} alt="" className="anon" />
            <p>Sending feedbacks anonymosly...</p>
            <div className="red-text center">
              {this.props.authError ? <p>{this.props.authError}</p> : null}
            </div>
            <Input
              type={"email"}
              name={"email"}
              label={"Email"}
              value={this.state.email}
              onChange={this.handleChange}
            />

            <Input
              type={"password"}
              name={"password"}
              label={"Password"}
              value={this.state.password}
              onChange={this.handleChange}
            />
            <p className="forgot-password">Forgot Password?</p>
            <button onClick={this.handleSubmit} className="submit">
              Sign In
            </button>
            <p>
              New User? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
          <div className="cookie">
            <p className="cookie-notice">
              By continuing to use our website, you confirm that you have read
              and agreed to our updated Privacy Policy and Terms and Conditions
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signin: credentials => dispatch(signIn(credentials))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
