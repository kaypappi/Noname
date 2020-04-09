import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { updateActiveChat } from "../../../../store/actions/chatActions";
import { db } from "../../../../config";
import Avatar from "avataaars";
import Profile from "../../../../Assets/profile.png";

class ChatPreview extends Component {
  state = {
    chats: {},
    partner: {},
    users: {},
    itemId: "",
    uid: ""
  };

  getUsers = () => {
    return this.setState(
      {
        users: {}
      },
      () => {
        return db
          .collection("users")
          .doc(this.state.uid)
          .onSnapshot(
            {
              // Listen for document metadata changes
              includeMetadataChanges: true
            },
            doc => {
              const users = {
                id: doc.id,
                ...doc.data()
              };
              return this.setState({
                users
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
        uid: this.props.uid
      },
      () => {
        this.getUsers();
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.uid !== prevProps.uid) {
      this.setState(
        {
          itemId: this.props.item.id,
          uid: this.props.uid
        },
        () => {
          this.getUsers();
        }
      );
    }
  }
  render() {
    if (this.state.users.fullName) {
      const fullName = this.props.item.anonStatus[this.state.uid] ?this.state.users.fullName : this.state.users.realName;;
      const msg = this.props.item.message.slice(0, 40) + "...";
      const avatar = this.state.users.avatar;
      return (
        <div
          onClick={() => {
            this.props.updateactivechat(this.props.item);
          }}
          className={`previews-wrapper pt-1  ${
            this.props.activeChat.id === this.props.item.id ? "activeChat" : ""
          }`}
        >
          <div className="preview-wrapper">
            <div className="preview-left ">
              <div className="preview-title text-sm font-semibold">{fullName}</div>
              <div className="preview-msg text-xs">{msg}</div>
            </div>
            <div className="preview-right ">
              {this.state.users.avatar && (
                <Avatar
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "0px",
                    alignSelf: "end"
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

const mapStateToProps = state => {
  return {
    /* firestore: state.firestore,
    chats: state.firestore.ordered.chats,
    partner: state.firestore.ordered.users,*/
    activeChat: state.chat.activeChat
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateactivechat: data => dispatch(updateActiveChat(data))
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
