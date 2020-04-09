import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import Avatar from "avataaars";
import Menu from "../../../../Assets/menu.svg";
import "./chatHeader.css";
import * as _ from "underscore";

class ChatHeader extends Component {
  state = {
    partner:{},
    fullName:'',
    chatsMap:{},
    partnerLoaded:false,
  };

  componentDidMount(){
    if (
      this.props.partner !== null &&
      this.props.partner !== undefined 
    ) {
      this.setState({
        partner: this.props.partner[0],
        partnerLoaded:true
      });
    }

    if (
      this.props.chatsMap !== null &&
      this.props.chatsMap !== undefined
    ) {
      this.setState({
        chatsMap: this.props.chatsMap[0]
      });
    }
  }
  


  componentDidUpdate(prevProps, prevState) {
    const isPartnerEqual = _.isEqual(this.props.partner, prevProps.partner),
      isChatsMapEqual = _.isEqual(this.props.chatsMap, prevProps.chatsMap);
    if (
      this.props.partner !== null &&
      this.props.partner !== undefined &&
      !isPartnerEqual
    ) {
      this.setState({
        partner: this.props.partner[0],
        partnerLoaded:true
      });
    }

    if (
      this.props.chatsMap !== null &&
      this.props.chatsMap !== undefined &&
      !isChatsMapEqual
    ) {
      this.setState({
        chatsMap: this.props.chatsMap[0]
      });
    }
  }
  render() {
    let test=this.state.partnerLoaded ? this.state.partner:'nopartner'
    let avatar = this.state.partner.id ? this.state.partner.avatar : ''
    let isAnon=this.state.chatsMap.id && this.state.chatsMap.anonStatus[this.props.uid]
    let fullName = this.state.chatsMap.id && (isAnon
      ? this.state.partner.fullName
      : this.state.partner.realName)
    return (
      <div id='#chatheader' className="chat-view-header  px-2 lg:px-8  w-full">
        <div className="header-left self-center ">
          {this.state.partner.avatar && (
            <Avatar
              style={{
                width: "100%",
                height: "auto",
                padding: "10px ",
                alignSelf: "end",
              }}
              avatarStyle={avatar.avatarStyle}
              topType={avatar.topType}
              accessoriesType={avatar.accessoriesType}
              hatColor={avatar.hatColor}
              graphicType={avatar.graphicType}
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
        <div className="header-right  self-center text-white font-semiblold w-full">
          <div>
            <p className="text-base lg:text-xl font-semibold">Chatting With </p>
            <p className="text-xs lg:text-lg">{fullName}</p>
          </div>
          {!this.props.sidebarDocked &&
          this.props.sidebarDocked !== undefined ? (
            <div
              onClick={() => {
                this.props.onSetSidebarOpen(true);
              }}
              className="hamburger"
            >
              <img src={Menu} alt="" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    firestore: state.firestore,
    partner: state.firestore.ordered.users,
    activeChat: state.chat.activeChat,
    chatsMap: state.firestore.ordered.chatsMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
    },
    {
      collection: "chatsMap",
      doc: props.activeChat.id,
    },
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(ChatHeader);
