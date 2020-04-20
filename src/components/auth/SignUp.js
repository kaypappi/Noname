import React, { Component } from "react";
import "./SignIn.css";
import { Link } from "react-router-dom";
import paint from "../../Assets/Rectangle.png";
import anon from "../../Assets/noname.png";
import Input from "../extras/Input";
import SelectField from "../extras/SelectField";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";
import RapperName from "rapper-name-generator";

class SignUp extends Component {
  state = {
    name: "",
    error: "",

    username: "",
    email: "",
    password: "",
    Cpassword: "",
    gender: "Male",
    janeDoe: {
      avatarStyle: "Circle",
      topType: "LongHairStraight",
      accessoriesType: "Prescription01",
      hairColor: "Brown",
      facialHairType: "Blank",
      clotheType: "Overall",
      clotheColor: "Gray01",
      eyeType: "Wink",
      eyebrowType: "UpDown",
      mouthType: "Smile",
      skinColor: "Tanned",
    },
    johnDoe: {
      avatarStyle: "Circle",
      topType: "ShortHairShortCurly",
      accessoriesType: "Wayfarers",
      hairColor: "Blonde",
      facialHairType: "BeardMagestic",
      facialHairColor: "Auburn",
      clotheType: "ShirtCrewNeck",
      clotheColor: "PastelYellow",
      eyeType: "Happy",
      eyebrowType: "UpDown",
      mouthType: "Twinkle",
      skinColor: "Tanned",
    },
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
      this.state.gender &&
      this.state.password &&
      this.state.Cpassword &&
      this.state.Cpassword === this.state.password
    ) {
      return true;
    } else {
      this.setState({error:'All fields are required and passwords must match!'})
      return false;
    }
  };

  handleSelect = (e) => {
    this.setState({
      gender: e.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validateFields() === true) {
      const avatar =
        this.state.gender === "Male" ? this.state.johnDoe : this.state.janeDoe;
      const anonName = RapperName();
      this.props.signup(this.state, avatar, anonName);
      this.setState({
        error:''
      })
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
    const options = [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ];
    return (
      <div className="signin-wrapper">
        <div className="signin-left">
          <img src={paint} alt="" className="paint" />
        </div>
        <div className="signin-right">
          <div className="form-holder">
            <img src={anon} alt="" className="anon" />
            <p>Sending feedbacks anonymosly...</p>
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

            <div className="select-holder">
              <SelectField
                handleSelect={this.handleSelect}
                defaultValue={options[0]}
                options={options}
                item={{ label: "Gender" }}
              />
            </div>
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
            <p className=" my-2 forgot-password">Forgot Password?</p>
            <button onClick={this.handleSubmit} className="my-2 submit">
              Sign Up
            </button>
            <p>
              Existing User? <Link to="/signin">Sign In</Link>
            </p>
          </div>
          <div className="cookie">
            <p className="text-xs cookie-notice">
              By continuing to use our website, you confirm that you have read
              and agreed to our updated Privacy Policy and Terms and Conditions
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (newUser, avatar, anonName) => {
      dispatch(signUp(newUser, avatar, anonName));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.authError,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
