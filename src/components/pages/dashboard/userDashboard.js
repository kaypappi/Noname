import React, { Component } from "react";
import ChatPreviews from "./chat/chatPreviews";
import Profile from "../../../Assets/profile.png";
import ReactModal from "react-modal";
import Textarea from "../../extras/textArea";
import ChatHeader from "./chat/chatHeader";
import ChatBody from "./chat/chatBody";
import Send from "../../../Assets/send2.svg";
import Incognito from "../../../Assets/incognito_dark.svg";
import Incognito_light from "../../../Assets/incognito_light.svg";
import Incognito_dark from "../../../Assets/incognito_light.svg";
import Bell_light from "../../../Assets/notification_light.svg";
import Bell_dark from "../../../Assets/notifications_dark.svg";
import Menu3 from "../../../Assets/menu3-light.svg";
import { connect } from "react-redux";
import { sendChat, updateAnonStatus } from "../../../store/actions/chatActions";
import {
  updateAvatar,
  signOut,
  getFcmToken,
  delFcmToken,
} from "../../../store/actions/authActions";
//import Avatar from "../../../Assets/avatar.jpg";
import Avatar from "avataaars";
import Sidebar from "react-sidebar";
import ToggleButton from "react-simple-switch";
import SelectField from "../../extras/SelectField";
import SignupModal from "./signupModal";
import { optionsArr } from "./chat/data";
import { API } from "../../auth/helpers/routes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from "../../extras/Alert";
import Popup from "./chat/popupMenu";

import { firestore } from "firebase";

const mql = window.matchMedia(`(min-width: 800px)`);

const windowHeight = window.innerHeight;

class UserDashboard extends Component {
  state = {
    alertMessage: "",
    newMessage: false,
    sidebarDocked: mql.matches,
    sidebarOpen: false,
    showModal: false,
    TempAvatar: "",
    uploadCount: 0,
    showToggle: true,
    toggleState: true,
    copySuccess: false,
    windowHeight: window.innerHeight,
    turnedOnNotif: 0,
  };

  copyCodeToClipboard = (message, time=2000) => {
    this.setState(
      {
        copySuccess: !this.state.copySuccess,
        alertMessage: message,
      },
      () => {
        setTimeout(() => {
          this.setState({
            copySuccess: !this.state.copySuccess,
          });
        }, time);
      }
    );
  };

  updateTurnedOnNotif = () => {
    this.setState({
      turnedOnNotif: this.state.turnedOnNotif + 1,
    });
  };

  reportWindowSize = () => {
    this.setState({
      windowHeight: window.innerHeight,
    });
  };

  componentDidMount() {
    mql.addListener(this.mediaQueryChanged);
    window.addEventListener("resize", this.reportWindowSize);
    this.setState({
      TempAvatar: this.props.firebase.profile.avatar,
    });

    
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.firebase.profile.isEmpty === false) {
      if(!this.props.firebase.profile.fcmToken){
        this.copyCodeToClipboard('Click the bell in the menu to turn on chat notifications',4000)
      }
      if (
        this.state.TempAvatar !== this.props.firebase.profile.avatar &&
        this.state.uploadCount < 1
      ) {
        this.setState({
          TempAvatar: this.props.firebase.profile.avatar,
          uploadCount: this.state.uploadCount + 1,
        });
      }
    }

    if (
      prevProps.activeChat.id &&
      this.props.activeChat.id !== prevProps.activeChat.id
    ) {
      this.setState(
        {
          showToggle: false,
        },
        () => {
          this.setState({
            showToggle: true,
          });
        }
      );
    }
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  };

  closeSidebar = () => {
    this.setState({
      sidebarOpen: false,
    });
  };

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  };

  handleText = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  setNewMessage = () => {
    this.setState({
      newMessage: true,
    });
  };

  handleSelect = (value, label) => {
    const newAvatar = { ...this.state.TempAvatar };
    newAvatar[label] = value.value;
    this.setState({
      TempAvatar: newAvatar,
      uploadCount: this.state.uploadCount + 1,
    });
  };

  handleSubmit = () => {
    if (this.state.message && this.props.auid) {
      this.props.sendChat(
        this.state,
        this.props.activeChat.map
          .filter((item) => item !== this.props.auth.uid)
          .join(""),
        this.props.auid
      );
      this.setState({
        message: "",
        newMessage: true,
      });
    }
  };

  handleChange = (toggleState) => {
    this.setState({ toggleState: !toggleState }, () => {
      this.props.updateanonstatus(this.props.activeChat, this.props.auid);
    });
  };

  handleUpdateAvatar = () => {
    if (this.state.uploadCount > 1) {
      this.props.updateavatar(this.state.TempAvatar, this.props.auth.uid);
    }
  };

  render() {
    const profile = this.props.firebase.profile;
    const avatar = { ...profile.avatar };
    let Tempavatar = this.state.TempAvatar ? this.state.TempAvatar : "";
    const { toggleState } = this.state;
    const url = `${API.protocol}${API.host}/user/${this.props.auth.uid}`;

    return (
      <div>
        {this.state.sidebarDocked && (
          <div class="container user-dashboard flex flex-wrap">
            <div
              style={{ height: this.state.windowHeight }}
              className="dash-left   w-1/4  "
            >
              <div className="dash-profile text-white  shadow-lg">
                <div className="avatar-holder" onClick={this.handleOpenModal}>
                  <Avatar
                    style={{
                      width: "100%",
                      height: "auto",
                      alignSelf: "end",
                      cursor: "pointer",
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
                </div>
                <div className="text-center">
                  <div className="text-xl">
                    {this.props.auth.isAnonymous ? (
                      ""
                    ) : (
                      <p className="flex justify-center">
                        <span className=" justify-center  px-2  text-xs font-bold ">
                          Name: {profile.realName}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="text-lg">
                    <p className="flex justify-center">
                      <span className=" justify-center  px-2  text-xs font-bold ">
                        Anon Id: {profile.fullName}
                      </span>
                    </p>
                    {!this.props.auth.isAnonymous && (
                      <CopyToClipboard
                        text={url}
                        onCopy={() => {
                          this.copyCodeToClipboard("Link Copied!");
                        }}
                      >
                        <span style={{cursor:'pointer'}} className="bg-teal-700 px-2 py-1 rounded">
                          Copy Link
                        </span>
                      </CopyToClipboard>
                    )}
                  </div>
                </div>
              </div>
              <div className="chats-section pt-2  shadow-lg rounded-lg">
                <div className="chats-section-title pt-1 text-sm  font-semibold pb-2">
                  Anonymous Chats
                </div>
                <div className="chat-preview-holder ">
                  <ChatPreviews
                    uuid={this.props.uuid}
                    auid={this.props.auid}
                    uid={this.props.auid}
                    newMessage={this.state.newMessage}
                    setNewMessage={this.setNewMessage}
                  />
                </div>
                <div className="chats-section-bottom">
                  {this.props.auth.isAnonymous && (
                    <div className="bottom-msg text-center text-xs">
                      Your Anonymous account may not last long. SignUp to retain
                      your account and chats
                    </div>
                  )}
                  <div className="nav-options">
                    <div
                      onClick={() => {
                        this.props.history.push("/");
                      }}
                      className="nav-home  bg-blue-300 hover:bg-blue-700 text-center font-semibold text-white text-sm"
                    >
                      Home
                    </div>
                    {!this.props.auth.isAnonymous ? (
                      <div
                        onClick={this.props.signout}
                        className="nav-signout bg-blue-300 hover:bg-blue-700 text-center font-semibold text-white text-sm"
                      >
                        Sign Out
                      </div>
                    ) : (
                      <SignupModal />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{ height: this.state.windowHeight }}
              className="chat-view shadow-lg relative  w-3/4 bg-red-100"
            >
              <Alert
                show={this.state.copySuccess}
                message={this.state.alertMessage}
              />
              {!this.props.activeChat.id ? (
                <div className="no-active-chat rounded-lg bg-white flex">
                  <div className="no-chats self-center justify-center w-full text-center purple-400">
                    No Chats Selected...Select A Chat In The Sidebar Or Share
                    Your Link To Your Friends So They Can Chat With You
                    Anonymously
                  </div>
                </div>
              ) : (
                <div className="chat-view-holder">
                  {this.props.activeChat.map && (
                    <ChatHeader
                      uid={this.props.activeChat.map
                        .filter((item) => item !== this.props.auth.uid)
                        .join("")}
                      activeChat={this.props.activeChat}
                    />
                  )}
                  <div className="chat-view-body   bg-yellow-300">
                    {!this.props.activeChat.id ? (
                      <div className="no-active-chat bg-white flex">
                        <div className="no-chats self-center justify-center w-full text-center purple-400">
                          No Chats Yet... Send a message below
                        </div>
                      </div>
                    ) : (
                      this.props.activeChat.map && (
                        <ChatBody
                          auth={this.props.auth}
                          uid={this.props.activeChat.map
                            .filter((item) => item !== this.props.auth.uid)
                            .join("")}
                          item={this.props.activeChat}
                          newMessage={this.state.newMessage}
                          setNewMessage={this.setNewMessage}
                        />
                      )
                    )}

                    <div
                      style={{
                        gridTemplateColumns: this.props.auth.isAnonymous
                          ? "1fr 40px"
                          : "70px 1fr 40px",
                      }}
                      id="send-chat"
                      className="send-chat   bg-purple-200 w-full"
                    >
                      {!this.props.auth.isAnonymous &&
                        this.props.activeChat.id && (
                          <div
                            className={`toggle-wrapper ${
                              this.props.activeChat.anonStatus[this.props.auid]
                                ? "active"
                                : ""
                            }`}
                          >
                            {this.state.showToggle && (
                              <ToggleButton
                                onChange={this.handleChange}
                                initState={
                                  !this.props.activeChat.anonStatus[
                                    this.props.auid
                                  ]
                                }
                                buttonDesign="rounded"
                                textData={{
                                  stateOne: <img src={Incognito_light} />,
                                  stateTwo: <img src={Incognito} />,
                                }}
                              />
                            )}
                          </div>
                        )}
                      <div className="message-holder ">
                        <Textarea
                          value={this.state.message}
                          placeHolder={"Start Typing..."}
                          handleText={this.handleText}
                        />
                      </div>
                      <div className="send-wrapper  ">
                        <img
                          onClick={this.handleSubmit}
                          style={{ width: "40px", height: "40px" }}
                          src={Send}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!this.state.sidebarDocked && (
          <div>
            <Sidebar
              sidebar={
                <div
                  style={{ height: this.state.windowHeight }}
                  className="dash-left   w-full  "
                >
                  <div className="dash-profile text-white relative shadow-lg">
                    <div
                      style={{
                        width: "20px",
                        top: "30px",
                        left: "30px",
                      }}
                      className="absolute"
                    >
                      <Popup
                        auth={this.props.auth}
                        signout={this.props.signout}
                        openAvatar={this.handleOpenModal}
                        copyCodeToClipboard={this.copyCodeToClipboard}
                      />
                    </div>
                    <div
                      style={{
                        width: "20px",
                        top: "30px",
                        right: "30px",
                      }}
                      className="absolute"
                    >
                      <img
                        onClick={
                          typeof profile.fcmToken == "string"
                            ? () => {
                                this.props.delfcmtoken(this.props.auth.uid);
                                this.copyCodeToClipboard(
                                  "Turned Off Chat Notifications"
                                );
                              }
                            : this.state.turnedOnNotif > 0
                            ? () => {
                                this.copyCodeToClipboard(
                                  "Can only be used once, reload and retry"
                                );
                              }
                            : () => {
                                this.props.getfcmtoken(this.props.auth.uid);
                                this.copyCodeToClipboard(
                                  "Turned On Chat Notifications "
                                );
                                this.updateTurnedOnNotif();
                              }
                        }
                        src={profile.fcmToken ? Bell_dark : Bell_light}
                        alt=""
                      />
                    </div>
                    <div
                      className="avatar-holder"
                      onClick={this.handleOpenModal}
                    >
                      <Avatar
                        style={{
                          width: "100%",
                          height: "auto",
                          alignSelf: "end",
                          cursor: "pointer",
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
                    </div>
                    <div className="text-center">
                      <div className="text-xl">
                        {this.props.auth.isAnonymous ? (
                          ""
                        ) : (
                          <p className="flex justify-center">
                            <span className=" justify-center  px-2  text-xs font-bold ">
                              Name: {profile.realName}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="text-lg">
                        <p className="flex justify-center">
                          <span className=" justify-center  px-2  text-xs font-bold ">
                            Anon Id: {profile.fullName}
                          </span>
                        </p>
                        {!this.props.auth.isAnonymous && (
                          <CopyToClipboard
                            text={url}
                            onCopy={() => {
                              this.copyCodeToClipboard("Link copied!");
                            }}
                          >
                            <span className="bg-teal-700 px-2 py-1 rounded">
                              Copy Link
                            </span>
                          </CopyToClipboard>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="chats-section pt-2 lg:pt-4  shadow-lg">
                    <div className="chats-section-title pt2  font-semibold pb-2 lg:pb-4">
                      Anonymous Chats
                    </div>
                    <div className="chat-preview-holder ">
                      <ChatPreviews
                        uuid={this.props.uuid}
                        auid={this.props.auid}
                        uid={this.props.auid}
                        newMessage={this.state.newMessage}
                        setNewMessage={this.setNewMessage}
                        closeSidebar={this.closeSidebar}
                        sidebarOpen={this.state.sidebarOpen}
                      />
                    </div>
                    <div className="chats-section-bottom">
                      {this.props.auth.isAnonymous && (
                        <div className="bottom-msg text-center text-xs">
                          Your Anonymous account may not last long. SignUp to
                          retain your account and chats
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
              open={
                !this.props.activeChat.id
                  ? !this.state.sidebarOpen
                  : this.state.sidebarOpen
              }
              docked={this.state.sidebarDocked}
              onSetOpen={this.onSetSidebarOpen}
              rootClassName={"sidebarClass"}
              touch={true}
              styles={{
                root: { top: "0px" },
                overlay: { top: "0px" },
                sidebar: {
                  background: "white",
                  width: !this.props.activeChat.id ? "100%" : "80%",
                },
              }}
            >
              <div
                style={{ height: this.state.windowHeight }}
                className="chat-view relative  w-full bg-red-100"
              >
                <Alert
                  show={this.state.copySuccess}
                  message={this.state.alertMessage}
                />
                {!this.props.activeChat.id ? (
                  <div className="no-active-chat bg-white flex">
                    <div className="no-chats self-center justify-center w-full text-center purple-400">
                      No Chats Selected...Select A Chat In The{" "}
                      <span
                        onClick={() => {
                          this.onSetSidebarOpen(true);
                        }}
                        className="text-blue-300"
                      >
                        Sidebar
                      </span>{" "}
                      Or Share Your Link To Your Friends So They Can Chat With
                      You Anonymously
                    </div>
                  </div>
                ) : (
                  <div className="chat-view-holder">
                    {this.props.activeChat.map && (
                      <ChatHeader
                        uid={this.props.activeChat.map
                          .filter((item) => item !== this.props.auth.uid)
                          .join("")}
                        activeChat={this.props.activeChat}
                        sidebarDocked={this.state.sidebarDocked}
                        onSetSidebarOpen={this.onSetSidebarOpen}
                      />
                    )}
                    <div className="chat-view-body   bg-yellow-300">
                      {!this.props.activeChat.id ? (
                        <div className="no-active-chat bg-white flex">
                          <div className="no-chats self-center justify-center w-full text-center purple-400">
                            No Chats Yet... Send a message below
                          </div>
                        </div>
                      ) : (
                        this.props.activeChat.map && (
                          <ChatBody
                            auth={this.props.auth}
                            uid={this.props.activeChat.map
                              .filter((item) => item !== this.props.auth.uid)
                              .join("")}
                            item={this.props.activeChat}
                            newMessage={this.state.newMessage}
                            setNewMessage={this.setNewMessage}
                          />
                        )
                      )}

                      <div
                        style={{
                          gridTemplateColumns: this.props.auth.isAnonymous
                            ? "1fr 40px"
                            : "70px 1fr 40px",
                        }}
                        id="send-chat"
                        className="send-chat   bg-purple-200 w-full"
                      >
                        {!this.props.auth.isAnonymous &&
                          this.props.activeChat.id && (
                            <div
                              className={`toggle-wrapper ${
                                this.props.activeChat.anonStatus[
                                  this.props.auid
                                ]
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {this.state.showToggle && (
                                <ToggleButton
                                  onChange={this.handleChange}
                                  initState={
                                    !this.props.activeChat.anonStatus[
                                      this.props.auid
                                    ]
                                  }
                                  buttonDesign="rounded"
                                  textData={{
                                    stateOne: <img src={Incognito_light} />,
                                    stateTwo: <img src={Incognito} />,
                                  }}
                                />
                              )}
                            </div>
                          )}
                        <div className="message-holder ">
                          <Textarea
                            value={this.state.message}
                            placeHolder={"Start Typing..."}
                            handleText={this.handleText}
                          />
                        </div>
                        <div className="send-wrapper  ">
                          <img
                            onClick={this.handleSubmit}
                            style={{ width: "40px", height: "40px" }}
                            src={Send}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Sidebar>
          </div>
        )}

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Edit Profile"
          onRequestClose={this.handleCloseModal}
          overlayClassName="avatar-overlay"
          className="avatar-modal shadow-lg rounded"
        >
          <div className="update-avatar-wrapper">
            <div className="avatar-top">
              <p className="text-xl font-semibold">Update Avatar</p>
              <h1 className="cursor-pointer" onClick={this.handleCloseModal}>
                X
              </h1>
            </div>
            <div className="avatar-body">
              {this.state.TempAvatar ? (
                <Avatar
                  style={{
                    width: "100px",
                    height: "100px",
                    alignSelf: "end",
                    margin: "auto",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                  avatarStyle={Tempavatar.avatarStyle}
                  topType={this.state.TempAvatar.topType}
                  accessoriesType={this.state.TempAvatar.accessoriesType}
                  hatColor={this.state.TempAvatar.hatColor}
                  hairColor={this.state.TempAvatar.hairColor}
                  facialHairType={this.state.TempAvatar.facialHairType}
                  clotheType={this.state.TempAvatar.clotheType}
                  clotheColor={this.state.TempAvatar.clotheColor}
                  graphicType={this.state.TempAvatar.graphicType}
                  eyeType={this.state.TempAvatar.eyeType}
                  eyebrowType={this.state.TempAvatar.eyebrowType}
                  mouthType={this.state.TempAvatar.mouthType}
                  skinColor={this.state.TempAvatar.skinColor}
                />
              ) : (
                ""
              )}
            </div>
            <div className="avatar select">
              {this.state.TempAvatar &&
                optionsArr.map((item, index) => {
                  if (
                    item.label === "hairColor" &&
                    Tempavatar["topType"].match(
                      /^(NoHair|Eyepatch|Hat|Hijab|Turban|WinterHat|WinterHat2|WinterHat3|WinterHat4)$/i
                    )
                  ) {
                    return;
                  } else if (
                    item.label === "accessoriesType" &&
                    Tempavatar["topType"].match(/^(Eyepatch)$/i)
                  ) {
                    return;
                  } else if (
                    item.label === "hatColor" &&
                    !Tempavatar["topType"].match(
                      /^(Hijab|Turban|WinterHat|WinterHat2|WinterHat3|WinterHat4)$/i
                    )
                  ) {
                    return;
                  } else if (
                    item.label === "clotheColor" &&
                    Tempavatar["clotheType"].match(
                      /^(BlazerShirt|BlazerSweater)$/i
                    )
                  ) {
                    return;
                  } else if (
                    item.label === "graphicType" &&
                    !Tempavatar["clotheType"].match(/^(GraphicShirt)$/i)
                  ) {
                    return;
                  } else {
                    const option = item.options.filter(
                      (option) => Tempavatar[item.label] === option.label
                    );
                    return (
                      <div key={index} className="option-holder">
                        <p>{item.Title}</p>
                        <SelectField
                          handleSelect={this.handleSelect}
                          defaultValue={option}
                          options={item.options}
                          item={item}
                        />
                      </div>
                    );
                  }
                })}
            </div>
            <div className="submit-btn-wrapper">
              <button
                onClick={() => {
                  this.handleUpdateAvatar();
                  this.handleCloseModal();
                }}
                class="signup-button mx-auto uppercase  shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4   rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    firestore: state.firestore,
    firebase: state.firebase,
    activeChat: state.chat.activeChat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendChat: (chat, uid, gid) => dispatch(sendChat(chat, uid, gid)),
    updateavatar: (avatar, auid) => dispatch(updateAvatar(avatar, auid)),
    signout: () => dispatch(signOut()),
    updateanonstatus: (activeChat, auid) =>
      dispatch(updateAnonStatus(activeChat, auid)),
    getfcmtoken: (auid) => dispatch(getFcmToken(auid)),
    delfcmtoken: (auid) => dispatch(delFcmToken(auid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
