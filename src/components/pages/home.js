import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "../extras/Alert";
import Logo from "../../Assets/noname.png";
import "./home.css";

class Home extends Component {
  state = {
    star: "",
    message: "",
  };
  componentDidMount() {
    if (this.props.location.state.message) {
      this.updateAlert(this.props.location.state.message, 10000);
    }
  }

  componentDidUpdate(prevProps, prevState) {}

  createStar = () => {
    let star = "";
    for (var i = 0; i < 200; i++) {
      star =
        star +
        '<div class="star m-0" style="animation: twinkle ' +
        (Math.random() * 5 + 5) +
        "s linear " +
        (Math.random() * 1 + 1) +
        "s infinite; top: " +
        Math.random() * window.innerHeight +
        "px; left: " +
        Math.random() * window.innerWidth +
        'px;"></div>';
    }
    return { __html: star };
  };

  updateAlert = (message, time = 2000) => {
    this.setState(
      {
        message,
      },
      () => {
        setTimeout(() => {
          this.setState({
            message: "",
          });
        }, time);
      }
    );
  };

  render() {
    return (
      <section
        id="homescreen"
        className="homescreen relative m-0 flex flex-col w-screen justify-center bg-gray-800 h-screen text-gray-100 "
      >
        <Alert message={this.state.message} show={this.state.message} />
        <div dangerouslySetInnerHTML={this.createStar()}></div>
        <nav>
          <ul className="flex justify-between text-xl py-8 px-8 md:px-48 ">
            <li>
              <img
                style={{ width: "50px", height: "50px" }}
                src={Logo}
                alt=""
              />
            </li>
            <li className="text-xs my-auto">
              <a
                href="https://www.linkedin.com/in/wesley-ukadike-3a9440180/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Made with 💚 by Wesley
              </a>
            </li>
          </ul>
        </nav>
        <div className="content-center w-full my-auto  justify-center">
          <h1 className="text-4xl text-center w-2/4 mx-auto">
            An App Has No Name
          </h1>
          <p className="text-teal-400 text-center mx-auto w-3/4 sm:w-2/4">
            An app has no name,so why should you? Send and receive texts while
            being anonymous! Chat, share links and keep guessing!!
          </p>
          <div className=" mx-auto mt-4 buttons-holder">
            <Link to="/signup">
              <div className="bg-teal-400  signup-btn">Sign Up</div>
            </Link>
            <Link to="/signin">
              <div className="bg-teal-400 signup-btn">Sign In</div>
            </Link>
          </div>
        </div>
        {/* <h1 className="text-6xl  my-auto mx-auto  md:mx-48 ">
          Delightful <br />
          <span className="text-teal-400">Web Templates.</span>
        </h1> */}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
  };
};

export default connect(mapStateToProps)(Home);
