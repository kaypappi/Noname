import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { db } from "../../../../config";
import IncomingChat from "./incomingChat";
import OutgoingChat from "./outgoingChat";
import TimeStamp from "./timeStamp";
import Loader from '../../../../Assets/Spinner.gif'
import * as _ from "underscore";
import "./chatBody.css";


class ChatBody extends Component {
  state = {
    chats: [],
    users: {},
    chatsMap: {},
    page: 0,
    loading: false,
    prevY: 0,
    updateChats: 0,
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleScroll = (e) => {
    if (e.target.classList.contains("on-scrollbar") === false) {
        e.target.classList.add("on-scrollbar");
    }

    setTimeout(()=>{
      e.target.classList.remove("on-scrollbar")
    },1500)
}

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
    const options = {
      root: document.querySelector("#chatbody"), 
      rootMargin: "0px",
      threshold: 0.8,
    };

    const bottomOptions = {
      root: document.querySelector("#bottom-watch"), 
      rootMargin: "0px",
      threshold: 1.0,
    };

    const bottomTarget=document.querySelector('#send-chat')
    const target = document.querySelector("#chatwatch");
    const observer = new IntersectionObserver(
      this.handleObserver, //callback
      options
    );

    const bottomObserrver=new IntersectionObserver(
      this.handleBottomObserver,bottomOptions
    )

    bottomObserrver.observe(bottomTarget)

    observer.observe(target);
    this.getUser();
    this.getChats();

    if (
      this.props.chatsMap !== null &&
      this.props.chatsMap !== undefined 
    ) {
      this.setState({
        chatsMap: this.props.chatsMap[0],
      });
    }
  }

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY !== 0 && this.state.prevY < y) {
      
      this.setState({
        updateChats: this.state.updateChats + 1,
      });
    }
    this.setState({ prevY: y });
  };

  handleBottomObserver=(entities,observer)=>{
    const y=entities[0].boundingClientRect.y
  }

  getUser = () => {
    return db
      .collection("users")
      .doc(this.props.uid)
      .onSnapshot((doc) => {
        const users = {
          id: doc.id,
          ...doc.data(),
        };
        return this.setState({
          users,
        });
      });
  };

  updateChats = () => {
    const doc = this.state.chats[0].timestamp;
    db.collection("chats")
      .doc(this.props.item.id)
      .collection("chatsmap")
      .orderBy("timestamp", "desc")
      .startAfter(doc)
      .limit(10)
      .onSnapshot((querySnapshot) => {
        let tempChats = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          return (tempChats = [{ id: doc.id, ...doc.data() }, ...tempChats]);
        });

        if (!_.isEqual(this.state.chats, tempChats)) {
          this.setState({
            chats: [...tempChats, ...this.state.chats],
            loading:false
          });
        }
        /* this.setState({
          chats: [...this.state.chats, ...tempChats],
        }); */
      });
  };

  getChats = () => {
    return db
      .collection("chats")
      .doc(this.props.item.id)
      .collection("chatsmap")
      .orderBy("timestamp", "desc")
      .limit(10)
      .onSnapshot((querySnapshot) => {
        if (this.props.newMessage) {
          this.setState(
            {
              chats: [],
            },
            () => {
              let tempChats = [];
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                return (tempChats = [
                  { id: doc.id, ...doc.data() },
                  ...tempChats,
                ]);
              });
              this.setState({
                chats: tempChats,
              },()=>{this.scrollToBottom();});
            }
          );
        } else {
          let tempChats = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            return (tempChats = [{ id: doc.id, ...doc.data() }, ...tempChats]);
          });
          this.setState({
            chats: tempChats,
          },()=>{this.scrollToBottom();});
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {
    const isChatsMapEqual = _.isEqual(this.props.chatsMap, prevProps.chatsMap);
    if (this.props.item.id !== prevProps.item.id) {
      this.getChats();
    }

    if (this.props.uid !== prevProps.uid) {
      this.getUser();
    }

    if (
      this.props.chatsMap !== null &&
      this.props.chatsMap !== undefined &&
      !isChatsMapEqual
    ) {
      this.setState({
        chatsMap: this.props.chatsMap[0],
      });
    }

    if (
      this.state.updateChats > prevState.updateChats &&
      this.props.chatsCount !== undefined &&
      this.state.chats.length < this.props.chatsCount[0].chatsCount
    ) {
    
      this.setState(
        {
          loading: true,
        },
        () => {
          this.updateChats();
        }
      );
    }
  }

  showChats = () => {};

  render() {
    const fullName =
      this.state.chatsMap.id && this.state.chatsMap.anonStatus[this.props.uid]
        ? this.state.users.fullName
        : this.state.users.realName;
    let prevChatTime = 0;
    let prevDay =
      this.state.chats.length > 0
        ? Math.floor(this.state.chats[0].timestamp.seconds / 86400)
        : "";
    return (
      <div id="chatbody" className="show-chats px-2 xl:px-8 bg-white w-full">
       
          {this.state.loading && <div className="loader">
          <img style={{width:'50px', height:'50px'}} src={Loader} alt=""/>
          </div>}
        <div
          id="chatwatch"
          style={{ height: "5px",width:'100%', position:'absolute', top:'0',left:'0' }}
          className="chatwatch"
        ></div>
        {this.state.chats &&
          this.state.chats.map((chat, index) => {
            let chatDay = Math.floor(chat.timestamp.seconds / 86400);
            if (chat.sender === this.props.auth.uid) {
              if (chatDay > prevDay) {
                prevDay = chatDay;
                return (
                  <div className="t">
                    <TimeStamp TimeStamp={chat.timestamp} />
                    <OutgoingChat index={index} chat={chat} />
                  </div>
                );
              } else {
                return (
                  <div className="chat-holder">
                    {index === 0 ? (
                      <TimeStamp TimeStamp={this.state.chats[0].timestamp} />
                    ) : (
                      ""
                    )}
                    <OutgoingChat index={index} chat={chat} />
                  </div>
                );
              }
            } else {
              if (chatDay > prevDay) {
                prevDay = chatDay;
                return (
                  <div className="t">
                    <TimeStamp TimeStamp={chat.timestamp} />
                    <IncomingChat
                      fullName={fullName}
                      index={index}
                      chat={chat}
                    />
                  </div>
                );
              } else {
                return (
                  <div className="chat-holder">
                    {index === 0 ? (
                      <TimeStamp TimeStamp={this.state.chats[0].timestamp} />
                    ) : (
                      ""
                    )}
                    <IncomingChat
                      fullName={
                        this.state.chatsMap.id &&
                        this.state.chatsMap.anonStatus[this.props.uid]
                          ? this.state.users.fullName
                          : this.state.users.realName
                      }
                      index={index}
                      chat={chat}
                    />
                  </div>
                );
              }
            }
          })}
       <div id='bottom-watch' style={{ height:'20px', float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    /* auth: state.firebase.auth,
      firestore: state.firestore,
      chats: state.firestore.ordered.chats,
      partner: state.firestore.ordered.users, */
    // activeChat:state.chat.activeChat
    chatsMap: state.firestore.ordered.chatsMap,
    chatsCount: state.firestore.ordered.chatsCount,
    chats2: state.firestore.ordered.chats2,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default compose(
  firestoreConnect((props) => [
    {
      collection: "chatsMap",
      doc: props.item.id,
    },
    {
      collection: "chats",
      doc: props.item.id,
      subcollections: [{ collection: "chatsmap", doc: "--stats--" }],
      storeAs: "chatsCount",
    },
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(ChatBody);
