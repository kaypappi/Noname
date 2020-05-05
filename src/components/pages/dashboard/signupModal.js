import React, { Component } from "react";
import ReactModal from "react-modal";
import Input from "../../extras/Input";
import { connect } from "react-redux";
import { upgradeAnon } from "../../../store/actions/authActions";
import anon from "../../../Assets/noname.png";
import "./signupModal.css";

const mql = window.matchMedia(`(min-width: 800px)`);

class signupModal extends Component {
  state = {
    showModal: false,
    name: "",
    username: "",
    email: "",
    password: "",
    Cpassword: "",
    error: "",
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleChange = (e) => {
    const field = e.target.name;
    this.setState({
      [field]: e.target.value,
    });
  };

  validateFields = () => {
    if (
      this.state.name &&
      this.state.username &&
      this.state.email &&
      this.state.password &&
      this.state.Cpassword &&
      this.state.Cpassword === this.state.password
    ) {
      return true;
    } else {
      this.setState({
        error: "All fields are required and passwords must match!",
      });
      return false;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validateFields() === true) {
      this.props.upgradeanon(this.state, this.props.auths.uid);
      //this.props.history.push("/dashboard");
    }
  };

  componentDidUpdate(prevProps,prevState){
    if(prevProps.auth!==this.props.auth){
      this.setState({
        error:this.props.auth
      })
    }
  }

  render() {
    return (
      <div>
        <div
          onClick={this.handleOpenModal}
          className={`nav-signout ${this.props.btnClass
            /* !mql
              ? "bg-blue-300 hover:bg-blue-700 text-center font-semibold text-white text-sm"
              : "text-xs font-semibold text-black"
           */}`}
        >
          Sign Up
        </div>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Edit Profile"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          overlayClassName="avatar-overlay"
          className="avatar-modal shadow-lg rounded"
        >
          <div>
            <div className="signup-form-holder">
              <div className="form-holder">
                <img
                  style={{ margin: "auto", width: "50px", height: "50px" }}
                  src={anon}
                  alt=""
                  className="anon"
                />
                <h1 onClick={this.handleCloseModal} className="close-modal">
                  X
                </h1>
                <p className="text-center">Sending chats anonymosly...</p>
                <div className="text-red-800 center">
                  {this.state.error ? <p>{this.state.error}</p> : null}
                </div>
                <Input
                  type={"text"}
                  name={"name"}
                  label={"Name"}
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <Input
                  type={"text"}
                  name={"username"}
                  label={"Username"}
                  value={this.state.username}
                  onChange={this.handleChange}
                />
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
                <Input
                  type={"password"}
                  name={"Cpassword"}
                  label={"Confrim Password"}
                  value={this.state.Cpassword}
                  onChange={this.handleChange}
                />
                <button
                  onClick={this.handleSubmit}
                  className="bg-teal-700 submit"
                >
                  Sign Up
                </button>
              </div>
              <div className="cookie">
                <p className="cookie-notice">
                  By continuing to use our website, you confirm that you have
                  read and agreed to our updated Privacy Policy and Terms and
                  Conditions
                </p>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //signup: (newUser)=>{dispatch(signUp(newUser))}
    upgradeanon: (credentials, auid) =>
      dispatch(upgradeAnon(credentials, auid)),
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.authError,
    auths: state.firebase.auth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(signupModal);
