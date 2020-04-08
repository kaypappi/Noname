import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import UserDashboard from "./userDashboard";
import Guestdashboard from "./GuestDashboard";
import Triangles from "../../../Assets/triangles.png";
import { Redirect } from "react-router-dom";
import { anonSignIn } from "../../../store/actions/authActions";
import { mapChats } from "../../../store/actions/chatActions";
import "./dashboard.css";
//import { uniqueNamesGenerator, Config, starWars, } from 'unique-names-generator';;
import RapperName from "rapper-name-generator";

class Dashboard extends Component {
  state = {
    showModal: true,
    anon: false,
    anonType: "",
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

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleSignUp = () => {
    return window.location.replace("/signup");
  };

  beAnon = () => {
    const avatar = {};
    this.setState({
      anon: true,
    });
  };

  handleJohn = () => {
    this.setState(
      {
        anonType: "john",
      },
      () => {
        this.anonSignup();
      }
    );
  };
  handleJane = () => {
    this.setState(
      {
        anonType: "jane",
      },
      () => {
        this.anonSignup();
      }
    );
  };

  createStar = () => {
    let star = "";
    for (var i = 0; i < 100; i++) {
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

  anonSignup = () => {
    const anonType = this.state.anonType;
    const avatar =
      this.state.anonType === "john" ? this.state.johnDoe : this.state.janeDoe;
    const anonName = RapperName();
    const credentials = {
      name: anonName,
      avatar,
      ruid: this.props.match.params.uid,
    };

    this.props.anonsignup(credentials);
  };

  componentDidUpdate() {
    if (this.props.auth.uid) {
      if (
        !this.props.activeChat.id &&
        this.props.match.params.uid !== this.props.auth.uid
      ) {
        this.props.mapchats(this.props.match.params.uid, this.props.auth.uid);
      }
    }
  }

  componentDidMount() {
    if (this.props.auth.uid) {
      if (
        !this.props.activeChat.id &&
        this.props.match.params.uid !== this.props.auth.uid
      ) {
        this.props.mapchats(this.props.match.params.uid, this.props.auth.uid);
      }
    }
  }
  render() {
    const { auth } = this.props;

    return (
      <div>
        {!auth.uid && (
          <div className="background-wrapper bg-gray-800">
            <div dangerouslySetInnerHTML={this.createStar()}></div>
            <ReactModal
              isOpen={this.state.showModal}
              contentLabel="Edit Profile"
              onRequestClose={this.handleCloseModal}
              overlayClassName="edit-overlay"
              className="signup-modal shadow-lg rounded"
            >
              {!this.state.anon && (
                <div className="modal-contents">
                  <div className="modal-text text-xl text-purle">
                    Seems Like You Are New Here!
                  </div>
                  <div className="modal-buttons w-full">
                    <button
                      onClick={this.handleSignUp}
                      class="signup-button mx-auto w-14 uppercase  shadow bg-teal-400 hover:bg-teal-800 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4   rounded"
                    >
                      SignUp
                    </button>
                    <button
                      onClick={this.beAnon}
                      class=" uppercase mx-auto w-14 shadow bg-teal-400 hover:bg-teal-800 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4   rounded"
                    >
                      Be Anonymous
                    </button>
                  </div>
                </div>
              )}
              {this.state.anon && (
                <div className="modal-contents">
                  <div className="modal-text text-xl text-purle">
                    Choose your avatar type
                  </div>
                  <div className="modal-buttons">
                    <button
                      onClick={this.handleJohn}
                      class="signup-button mx-auto uppercase  shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4   rounded"
                    >
                      John Doe
                    </button>
                    <button
                      onClick={this.handleJane}
                      class=" uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4   rounded"
                    >
                      Jane Doe
                    </button>
                  </div>
                </div>
              )}
            </ReactModal>
          </div>
        )}

        {auth.uid && (
          <div className="dashboard-wrapper">
            {
              <UserDashboard
                uuid={this.props.match.params.uid}
                auid={this.props.auth.uid}
                history={this.props.history}
                status={
                  auth.uid === this.props.match.params.uid ? "user" : "guest"
                }
              />
            }
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    activeChat: state.chat.activeChat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    anonsignup: (credentials) => {
      dispatch(anonSignIn(credentials));
    },
    mapchats: (uuid, auid) => {
      dispatch(mapChats(uuid, auid));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
