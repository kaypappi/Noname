import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { db } from "../../../../config";
import { firestoreConnect } from "react-redux-firebase";
import ChatPreview from "./chatPreview";

class ChatPreviews extends Component {
  state = {
    chatsMap: [],
    displayChats: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
    this.getChatsMap();
  }
  componentDidUpdate(prevProps, prevState) {}

  handleScroll = (e) => {
    if (e.target.classList.contains("on-scrollbar") === false) {
        e.target.classList.add("on-scrollbar");
    }

    setTimeout(()=>{
      e.target.classList.remove("on-scrollbar")
    },1500)
}

  getChatsMap = () => {
    return db
      .collection("chatsMap")
      .where("map", "array-contains", this.props.uid)
      .orderBy("timestamp")
      .onSnapshot(
        {
          // Listen for document metadata changes
          includeMetadataChanges: true
        },
        querySnapshot => {
          let tempChats = [];
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            return (tempChats = [{ id: doc.id, ...doc.data() }, ...tempChats]);
          });
          this.setState({
            chatsMap: tempChats,
            displayChats: true
          });
        }
      );
  };

  displayChatsPreview = () => {
    return this.state.chatsMap.map(item => {
      const uid = item.map.filter(item => item !== this.props.auid).join("");
      if(item.message!==''){
        return (
          <ChatPreview
            uid={uid}
            uuid={this.props.uuid}
            auid={this.props.auid}
            item={item}
          />
        );
      }
    });
  };

  render() {
    return (
      <div onClick={this.props.closeSidebar} className="chat-previews-holder">
        {this.state.chatsMap && this.displayChatsPreview()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    firestore: state.firestore
    //chatsMap: state.firestore.ordered.chatsMap
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ChatPreviews
);
