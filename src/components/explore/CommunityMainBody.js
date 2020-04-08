import React, { Component } from "react";
import "./CommunityMainBodyComponent.css";
import SubNavTab from "../ProfileContent/SubNavTabComponent";
import PostsComponent from "../Posts/postComponent";
import PostComponentMain from "../Posts/postComponentMain";
import { PostRequest, GetRequest, DeleteRequest } from "../../Helpers/request";
import API, {
  API_LEAVE_COMMUNITY,
  API_JOIN_COMMUNITY,
  API_DELETE_COMMUNITY
} from "../../Constants/api_routes";
import { ChangeCommunity } from "../../Actions/ChangeCommunityAction";
import { deleteNotification } from "../../Actions/DeleteNotificationAction";
import NewPostOptions from "../Posts/newPostOptions";
import newPostIcon from "../../Assets/SVG/add_post.svg";
import CancelIcon from "../../Assets/SVG/cancelIcon.svg";
import Spinner from "../../Assets/GIF/Spinner.gif";
import debounce from "lodash.debounce";
import { Pacman } from "react-pure-loaders";
import CommunityMediaComponent from "./CommunityMediaComponent";
import CommunityMembersComponent from "./CommunityMembersComponent";
import CommunityChatComponent from "./CommunityChatComponent";
import { connect } from "react-redux";

class CommunityMainBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollHeight: 0,
      currentTab: 1,
      post_options_style: false,
      short_name: this.props.short_name,
      moreLoading: false,
      loadingPosts: false,
      posts: [],
      currentPage: "",
      nextPage: "",
      lastPage: ""
    };
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  componentDidMount() {
    this.checkUrl(this.props.subMenu);
    this.getCommunityPosts();
    this.setState({
      short_name: this.props.short_name
    });

    window.onscroll = debounce(() => {
      if (
        !this.state.showPosts ||
        !this.state.nextPage ||
        this.state.moreLoading
      ) {
        return;
      } else if (
        Math.floor(
          window.innerHeight + document.documentElement.scrollTop + 1
        ) > document.documentElement.offsetHeight
      ) {
        this.setState(
          {
            moreLoading: true
          },
          () => {
            let url = this.state.nextPage.replace("http", "https");
            this.getCommunityPosts(url);
          }
        );
      }
    }, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    let prevLength = 0,
      newLength = 0;
    Object.values(prevProps.notifications).forEach(key => {
      prevLength = prevLength + key.length;
    });
    Object.values(this.props.notifications).forEach(key => {
      newLength = newLength + key.length;
    });
    if (
      newLength !== prevLength ||
      prevState.currentTab !== this.state.currentTab
    ) {
      //delete Notification of present Tab
      this.props.deleteNotification(
        this.state.currentTab,
        this.props.short_name
      );
    }
    if (this.props.short_name !== prevState.short_name) {
      this.setState({ short_name: this.props.short_name }, () => {
        this.getCommunityPosts();
      });
    }
  }

  getCommunityPosts = (
    URL = API.protocol +
      API.host +
      `/api/community/${this.props.short_name}/posts`
  ) => {
    if (this.state.currentPage === 1) {
      this.setState({
        moreLoading: true
      });
    } else {
      this.setState({
        loadingPosts: true
      });
    }
    if (this.state.short_name) {
      GetRequest(URL).then(response => {
        if (
          response.statusText === "error" &&
          response.result.message === "No Data!"
        ) {
          this.setState({ loadingPosts: false, posts: [] });
        } else if (response.statusText === "success") {
          this.setState({
            posts: response.result.links.prev_page
              ? [...this.state.posts, ...response.result.data]
              : [...response.result.data],

            currentPage: response.result.meta.current_page,
            nextPage: response.result.links.next_page,
            lastPage: response.result.meta.last_page,
            moreLoading: false,
            loadingPosts: false
          });
        }
      });
    }
  };

  toggleNewPost = () => {
    this.setState({
      post_options_style: this.state.post_options_style ? false : true
    });
  };

  closeNewPost = () => {
    this.setState({
      post_options_style: false
    });
  };

  checkUrl(url) {
    if (url.match("feeds")) {
      this.setState({
        currentTab: 1
      });
    } else if (url.match("chats")) {
      this.setState({
        currentTab: 2
      });
    } else if (url.match("members")) {
      this.setState({
        currentTab: 3
      });
    } else if (url.match("media")) {
      this.setState({
        currentTab: 4
      });
    }
  }

  changeCurrentPage(id) {
    this.setState({
      currentTab: id
    });
    if (id === 1) {
      this.props.history.push(`/${this.props.short_name}/feeds`);
    } else if (id === 2) {
      this.props.history.push(`/${this.props.short_name}/chats`);
    } else if (id === 3) {
      this.props.history.push(`/${this.props.short_name}/members`);
    } else if (id === 4) {
      this.props.history.push(`/${this.props.short_name}/media`);
    }
  }

  leaveGroupAction() {
    PostRequest(
      API_LEAVE_COMMUNITY.replace(":shortname", this.props.short_name)
    ).then(response => {
      if (response.statusText !== "error") {
        this.props.getAllUserGroups();
      }
    });
  }

  joinGroupAction(type) {
    PostRequest(
      API_JOIN_COMMUNITY.replace(":shortname", this.props.short_name)
    ).then(response => {
      if (response.statusText !== "error") {
        this.props.getAllUserGroups();
        if (type === "Request to join") {
          let btn = document.querySelector("#groupAction");
          btn.textContent = "Request Sent";
          btn.disabled = true;
        }
      }
    });
  }

  deleteGroupAction() {
    DeleteRequest(
      API_DELETE_COMMUNITY.replace(":shortname", this.props.short_name)
    ).then(response => {
      if (response.statusText !== "error") {
        this.props.getAllUserGroups();
      }
    });
  }

  groupAction(type) {
    if (type === "leave") {
      this.leaveGroupAction();
    } else if (type === "join" || type === "Request to join") {
      this.joinGroupAction(type);
    } else if (type === "delete") {
      this.deleteGroupAction();
    }
  }

  render() {
    let groupActionText = "",
      detailsActionText = "";
    if (this.props.communityDetails.owned === true) {
      groupActionText = "delete";
      detailsActionText = "Edit";
    } else {
      if (this.props.communityDetails.joined_at === null) {
        if (this.props.communityDetails.view_privacy === "public") {
          groupActionText = "join";
        } else {
          groupActionText = "Request to join";
        }
        detailsActionText = "Details";
      } else {
        groupActionText = "leave";
        detailsActionText = "Details";
      }
    }
    return (
      <div className="community-main-body">
        <div className="content-area">
          <div className="group-profile">
            <div className="basic-details">
              <div className="profile-pic"></div>
              <p className="communtiy-name">
                {this.props.communityDetails.name}
              </p>
              <p className="short-name">@{this.props.short_name}</p>
              <div className="quick-info">
                <p>{this.props.communityDetails.members_count} Members</p>
                <div className="small-blob"></div>
                <p>{this.props.communityDetails.view_privacy}</p>
                <div className="small-blob"></div>
                <a>{this.props.communityDetails.owner.username}</a>
              </div>
              @
              {this.props.communityDetails.description !== null && (
                <p className="communtiy-description">
                  {this.props.communityDetails.description}
                </p>
              )}
              <div className="quick-actions">
                <button
                  className={`${groupActionText}-action`}
                  id="groupAction"
                  onClick={this.groupAction.bind(this, groupActionText)}
                >
                  {groupActionText}
                </button>
                <button className="details-action">{detailsActionText}</button>
              </div>
            </div>
          </div>
          <div className="navigation">
            <SubNavTab
              tabs={["Feeds", "Chats", "Members", "Media"]}
              short_name={this.props.short_name}
              changeCurrentPage={this.changeCurrentPage}
            />
          </div>
          {this.state.currentTab === 1 && (
            <div className="community-feed">
              <div className="community-posts-section">
                {this.props.postId ? (
                  <PostComponentMain
                    short_name={this.props.short_name}
                    postId={this.props.postId}
                    history={this.props.history}
                    params={this.props.params}
                  />
                ) : !this.state.loadingPosts ? (
                  <div className="community-posts">
                    {this.state.posts.length === 0 ? (
                      <div className="no-posts">
                        <h3>No Post Yet On This Community</h3>
                        <p>Click The Button To Create Your Fisrt Post</p>
                      </div>
                    ) : (
                      <div>
                        <PostsComponent
                          short_name={this.props.short_name}
                          posts={this.state.posts}
                          history={this.props.history}
                        />
                        {this.state.moreLoading && (
                          <div className="loader">
                            <img
                              style={{
                                display: "block",
                                margin: "auto",
                                width: "100px"
                              }}
                              src={Spinner}
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="loader">
                    <img
                      style={{
                        display: "block",
                        margin: "auto",
                        width: "100px"
                      }}
                      src={Spinner}
                      alt=""
                    />
                  </div>
                )}
                <div className="new-post">
                  <NewPostOptions
                    short_name={this.props.short_name}
                    click={this.closeNewPost}
                    style={this.state.post_options_style}
                    currentCommunity={this.props.currentCommunity}
                  />
                  <img
                    onClick={this.toggleNewPost}
                    className="add-new-post"
                    src={
                      this.state.post_options_style ? CancelIcon : newPostIcon
                    }
                    alt="New Post"
                    height="60"
                    width="60"
                  />
                </div>
              </div>
              
            </div>
          )}
          {this.state.currentTab === 2 && (
            <CommunityChatComponent short_name={this.props.short_name} />
          )}

          {this.state.currentTab === 3 && (
            <CommunityMembersComponent
              short_name={this.props.short_name}
              owned={this.props.communityDetails.owned}
            />
          )}

          {this.state.currentTab === 4 && <CommunityMediaComponent />}
        </div>
        <div className="community-right-sidebar">uijnjknj</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatch = dispatch => {
  return {
    changeCommunity: community => {
      dispatch(ChangeCommunity(community));
    },
    deleteNotification: (currentTab, short_name) => {
      dispatch(deleteNotification(currentTab, short_name));
    }
  };
};

export default connect(mapStateToProps, mapDispatch)(CommunityMainBody);
