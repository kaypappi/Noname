import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import {
  updateActiveChat,
  clearNotifications,
} from "../../../../store/actions/chatActions";
import moment from "moment";
import { db } from "../../../../config";
import Avatar from "avataaars";
import Profile from "../../../../Assets/profile.png";

class ChatPreview extends Component {
  state = {
    chats: {},
    partner: {},
    users: {},
    itemId: "",
    uid: "",
    notifications_count: 0,
  };

  getUsers = () => {
    return this.setState(
      {
        users: {},
      },
      () => {
        return db
          .collection("users")
          .doc(this.state.uid)
          .onSnapshot(
            {
              // Listen for document metadata changes
              includeMetadataChanges: true,
            },
            (doc) => {
              const users = {
                id: doc.id,
                ...doc.data(),
              };
              return this.setState({
                users,
              });
            }
          );
      }
    );
  };

  componentDidMount() {
    this.setState(
      {
        itemId: this.props.item.id,
        uid: this.props.uid,
      },
      () => {
        this.getUsers();
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.sidebarOpen);
    if (this.props.uid !== prevProps.uid) {
      this.setState(
        {
          itemId: this.props.item.id,
          uid: this.props.uid,
        },
        () => {
          this.getUsers();
        }
      );
    }

    if (
      this.props.item.notifications[this.props.auth.uid] >
        prevProps.item.notifications[this.props.auth.uid] &&
      this.props.activeChat.id === this.props.item.id
    ) {
      this.setState({
        notifications_count: this.props.item.notifications[this.props.auth.uid],
      });
    }
    if (!this.props.sidebarOpen && this.state.notifications_count > 0) {
      this.props.clearnotifications(this.props.item, this.props.auth.uid);
      this.setState({ notifications_count: 0 });
    }
  }

  render() {
    if (this.state.users.fullName) {
      const fullName = this.props.item.anonStatus[this.state.uid]
        ? this.state.users.fullName
        : this.state.users.realName;
      const msg = this.props.item.message;
      const avatar = this.state.users.avatar;
      const notifications_count = this.props.item.notifications[
        this.props.auid
      ];
      return (
        <div
          key={this.props.index}
          onClick={() => {
            this.props.closeSidebar && this.props.closeSidebar();
            this.props.updateactivechat(this.props.item);
            this.props.clearnotifications(this.props.item, this.props.auth.uid);
          }}
          className={`previews-wrapper pt-1  ${
            this.props.activeChat.id === this.props.item.id ? "activeChat" : ""
          }`}
        >
          <div className="preview-wrapper">
            <div className="preview-left ">
              <div className="preview-title text-sm font-semibold">
                {fullName}
              </div>
              <div className="preview-msg text-xs">{msg}</div>
              <div className="flex items-center">
                <p
                  style={{ fontSize: "8px" }}
                  className="text-left   text-grey-dark"
                >
                  {moment(this.props.item.timestamp.toDate()).format("LT")}
                </p>

                {notifications_count > 0 && (
                  <span
                    style={{ fontSize: "6px", padding: "2px 4px" }}
                    className="bg-teal-800 rounded-full text-white ml-1"
                  >
                    {notifications_count < 100 ? notifications_count : "99"}
                  </span>
                )}
              </div>
            </div>
            <div className="preview-right self-center ">
              {this.state.users.avatar && (
                <Avatar
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "0px",
                    alignSelf: "end",
                  }}
                  avatarStyle={avatar.avatarStyle}
                  topType={avatar.topType}
                  accessoriesType={avatar.accessoriesType}
                  hairColor={avatar.hairColor}
                  facialHairType={avatar.facialHairType}
                  clotheType={avatar.clotheType}
                  clotheColor={avatar.clotheColor}
                  eyeType={avatar.eyeType}
                  eyebrowType={avatar.eyebrowType}
                  mouthType={avatar.mouthType}
                  skinColor={avatar.skinColor}
                />
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    /* firestore: state.firestore,
    chats: state.firestore.ordered.chats,
    partner: state.firestore.ordered.users,*/
    activeChat: state.chat.activeChat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateactivechat: (data) => dispatch(updateActiveChat(data)),
    clearnotifications: (activeChat, auid) =>
      dispatch(clearNotifications(activeChat, auid)),
  };
};

export default compose(
  /* firestoreConnect(props => [
    {
      collection: "chats",
      doc: props.item.id,
      subcollections: [{ collection: "chatsmap" }],
      storeAs: "chats",
      limit: 1,
      orderBy: ["timestamp", "desc"]
    },
    {
      collection: "users",
      doc: props.uid
    }
  ]), */
  connect(mapStateToProps, mapDispatchToProps)
)(ChatPreview);
