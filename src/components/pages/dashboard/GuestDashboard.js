import React, { Component } from "react";
import IncomingChat from "./chat/incomingChat";
import OutgoingChat from "./chat/outgoingChat";
import { connect } from "react-redux";
import { compose } from "redux";
import { sendChat } from "../../../store/actions/chatActions";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import Textarea from "../../extras/textArea";
import Send from "../../../Assets/send.svg";
import Profile from "../../../Assets/profile.png";

class GuestDashboard extends Component {
  state = {
    message: "",
    sid: "",
    chats: []
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props);
    if (this.props.chats !== undefined && prevProps.chats !== undefined) {
      if (
        this.props.chats[0][this.props.uid].length !== this.state.chats.length
      ) {
        let chats = this.props.chats[0][this.props.uid];
        console.log(chats, this.props.chats.lenght, prevProps.chats.length);
        this.setState(
          {
            chats: [...chats]
          },
          () => console.log(this.state)
        );
      }
    }
  }

  componentDidMount() {
    console.log(this.props);

    /* this.props.firestore
        .collection("chats").doc('zKO2AaZ9rne76wOkPvRLJy6snDp2')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        }) */

    /* console.log(
      this.props.firestore
        .collection("chats")
        .doc("zKO2AaZ9rne76wOkPvRLJy6snDp2")
        .collection("zKO2AaZ9rne76wOkPvRLJy6snDp2")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        })
    ); */

    /* let chats=this.props.firestore.collection('chats')
    chats.listCollections().then(collection=>{
      collection.forEach(collection => {
        console.log('Found subcollection with id:', collection.id);
      });
    })
    this.setState({
      sid: this.props.sid
    }); */
  }

  handleChange = e => {
    const field = e.target.name;
    this.setState({
      [field]: e.target.value
    });
  };

  handleSubmit = () => {
    console.log("start submit", this.state.message, this.props.sid);
    if (this.state.message && this.props.sid) {
      console.log("submit  message");
      this.props.sendChat(this.state, this.props.uid, this.props.sid);
    }
  };

  render() {
    return (
      <div>
        <div className="container guest-container ">
          <div className="flex rounded-lg bg-gray-400 p-8 mb-4 h-48">
            <div className="img-holder rounded-full h-32 w-32 my-auto p-4 bg-yellow-400"></div>
            <div className="content pt-4 ml-4 text-left">
              <div className="name text-lg">Wesley Ukadike</div>
              <div className="link text-md">
                www.jhbehbvjhbhjscbvbchsvbvhfv/efbivfue
              </div>
              <div className="username text-sm">@kaypappi</div>
            </div>
          </div>
          <div className="chat-view  w-full bg-red-100">
            <div className="chat-view-header   pt-2 pb-2 pl-8 pr-8 bg-green-300 w-full">
              <div className="header-left self-center w-full">
                <img
                  className=""
                  style={{ width: "100px", height: "100px" }}
                  src={Profile}
                  alt=""
                />
              </div>
              <div className="header-right text-2xl self-center text-white font-semiblold w-full">
                <h1>Anonymous Message from</h1>
                <h2>Damn Good</h2>
              </div>
            </div>
            <div className="chat-view-body   bg-yellow-300">
              <div className="show-chats pl-8 pr-8 bg-white w-full">
                <IncomingChat />
                <OutgoingChat />
                <IncomingChat />
                <OutgoingChat />
                <IncomingChat />
                <OutgoingChat />
                <IncomingChat />
                <OutgoingChat />
              </div>
              <div className="send-chat   bg-purple-200 w-full">
                <div className="message-holder ">
                  <Textarea />
                </div>
                <div className="send-wrapper  ">
                  <img
                    style={{ width: "40px", height: "40px" }}
                    src={Send}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendChat: (chat, uid, gid) => dispatch(sendChat(chat, uid, gid))
  };
};

const mapStateToProps = state => {
  const chats = state.firestore.ordered.chats;
  console.log(state, chats);
  return {
    chats: chats,
    auth: state.firebase.auth,
    firestore2: state.firestore
  };
};

export default compose(
  firestoreConnect([
    {
      collection: "chats",
      doc: "zKO2AaZ9rne76wOkPvRLJy6snDp2",

      subcollections: [{ collection: "zKO2AaZ9rne76wOkPvRLJy6snDp2" }]
    }
  ],[
    
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(GuestDashboard);
