import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { db } from "../../../../config";
import { firestoreConnect } from "react-redux-firebase";
import ChatPreview from "./chatPreview";
import Loader from "../../../../Assets/Spinner.gif";

class ChatPreviews extends Component {
  state = {
    chatsMap: [],
    displayChats: false,
    loading: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getChatsMap();
      }
    );
  }
  componentDidUpdate(prevProps, prevState) {}

  handleScroll = (e) => {
    if (e.target.classList !== undefined) {
      if (e.target.classList.contains("on-scrollbar") === false) {
        e.target.classList.add("on-scrollbar");
      }
      setTimeout(() => {
        e.target.classList.remove("on-scrollbar");
      }, 1500);
    }
  };

  getChatsMap = () => {
    return db
      .collection("chatsMap")
      .where("map", "array-contains", this.props.uid)
      .orderBy("timestamp")
      .onSnapshot(
        {
          // Listen for document metadata changes
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          let tempChats = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            return (tempChats = [{ id: doc.id, ...doc.data() }, ...tempChats]);
          });
          this.setState({
            chatsMap: tempChats,
            displayChats: true,
            loading: false,
          });
        }
      );
  };

  displayChatsPreview = () => {
    return this.state.chatsMap.map((item, index) => {
      const uid = item.map.filter((item) => item !== this.props.auid).join("");
      if (item.message !== "") {
        return (
          <div key={index}>
            <ChatPreview
              uid={uid}
              uuid={this.props.uuid}
              auid={this.props.auid}
              item={item}
              closeSidebar={this.props.closeSidebar}
              sidebarOpen={this.props.sidebarOpen}
            />
          </div>
        );
      }
    });
  };

  render() {
    return (
      <div
        onClick={this.props.closeSidebar}
        className=" h-full chat-previews-holder"
      >
        {this.state.loading ? (
          <div className="w-full flex h-full">
            <img
              className="mx-auto align-center my-auto "
              style={{ width: "100px", height: "100px" }}
              src={Loader}
              alt=""
            />
          </div>
        ) : (
          <div>
            {this.state.chatsMap.length > 0 ? (
              this.displayChatsPreview()
            ) : (
              <div className="w-full h-full flex">
                <div className="text-center align-center text-xs w-3/4 my-auto mx-auto">
                  You have no chats yet. Copy your link and publish to friends
                  to chat with you
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firestore: state.firestore,
    //chatsMap: state.firestore.ordered.chatsMap
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ChatPreviews
);
