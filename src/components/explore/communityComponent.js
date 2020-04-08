import React, { Component } from "react";
import "./CommunityComponent.css";
import CommunitySidePanel from "./CommunitySidePanelComponent";
import CommunityMainBody from "./CommunityMainBodyComponent";
import { ChangeCommunity } from "../../Actions/ChangeCommunityAction";
import Spinner from "../../Assets/GIF/Spinner.gif";
import {
  API_GET_ALL_COMMUNITIES,
  API_CREATE_COMMUNITY,
  API_GET_COMMUNITY_DETAILS,
  API_GET_INTERESTS_LIST,
  API_SEARCH_INTERESTS_LIST
} from "../../Constants/api_routes";
import { connect } from "react-redux";
import cancelIcon from "../../Assets/SVG/cancel.svg";
import ReactModal from "react-modal";
import { GetRequest, PostRequest } from "../../Helpers/request";

class CommunityComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      categories: [],
      selectedCategories: [],
      categoryIDs: [],
      category: "",
      categorySearchResults: [],
      updated: false,
      showModal: false,
      groupName: "",
      groupNameError: "",
      shortName: "",
      email: "",
      emailError: "",
      privatePostCreation: true,
      viewPrivacy: "private",
      currentCommunity: "",
      communityDetails: "",
      loadedGroups:false
    };
    this.suggestionBoxRef = React.createRef();
    this.categorySearchInputRef = React.createRef();
  }

  changeUrl = url => {
    
    if (url.includes("community")) {
      let newUrl = url.replace(
        "community",
        `${this.state.groups[0].short_name}/feeds`
      );
      this.props.history.push(newUrl);
    }
  };

  componentDidMount() {
    console.log(this.props);
    document.title = "Community | Explore";
    this.getInterests();
    this.getAllUserGroups();
    this.getCommunityDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showModal !== this.state.showModal) {
      this.getAllUserGroups();
    }
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getCommunityDetails();
      this.setState({
        currentCommunity: this.props.match.params.id
      });
    }
  }

  updateSideComponent() {
    this.setState({
      updated: !this.state.updated
    });
  }

  getAllUserGroups = () => {
    GetRequest(
      API_GET_ALL_COMMUNITIES.replace(
        ":username",
        this.props.loggedInUser.username.slice(1)
      )
    ).then(response => {
      if (response.statusText === "success") {
        this.setState(
          {
            groups: response.result,
            loadedGroups:true
          },
          () => {
            if(this.state.groups.length>0){
              this.changeUrl(window.location.pathname);
            }
          }
        );
      }
    });
  };

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false, groupNameError: "", emailError: "" });
  }

  validateEmail(targetValue, targetError) {
    if (
      !targetValue.match(
        /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$/g
      )
    ) {
      this.setState({
        [targetError]: "Inputed email is not correct"
      });
    } else {
      this.setState({
        [targetError]: ""
      });
    }
  }

  validateName(targetValue, targetError) {
    let maxLength = 170,
      currentLength = targetValue.length,
      difference = maxLength - currentLength;
    if (targetValue.length > 170) {
      this.setState({
        [targetError]: `${-difference} character(s) too long`
      });
      document.querySelector(`#${targetError}`).classList.remove("blue");
    } else {
      this.setState(
        {
          [targetError]: `${difference} characters left`
        },
        () => document.querySelector(`#${targetError}`).classList.add("blue")
      );
    }
  }

  validate(targetName, targetValue, targetError) {
    if (targetName === "email") {
      this.validateEmail(targetValue, targetError);
    } else if (targetName === "groupName") {
      this.validateName(targetValue, targetError);
    }
  }

  handleChange(event) {
    let targetValue = event.target.value,
      targetName = event.target.name,
      targetError = targetName + "Error";

    if (targetValue !== "" && targetValue !== null) {
      this.validate(targetName, targetValue, targetError);

      this.setState({
        [targetName]: targetValue
      });
    } else {
      this.setState({
        [targetName]: "",
        [targetError]: ""
      });
    }
  }

  postPrivacyChange = event => {
    this.setState({
      privatePostCreation: event.target.value === "true" ? true : false
    });
  };

  getCommunityDetails() {
    GetRequest(
      API_GET_COMMUNITY_DETAILS.replace(
        ":shortname",
        this.props.match.params.id
      )
    ).then(response => {
      if (response.statusText !== "error") {
        this.props.changeCommunity(response.result);

        this.setState({
          communityDetails: response.result,
          shortName: response.result.short_name
        });
      }
    });
  }

  createNewGroup(e) {
    e.preventDefault();
    PostRequest(API_CREATE_COMMUNITY, {
      name: this.state.groupName,
      short_name: `group${Date.now()}`,
      email: this.state.email,
      make_post_creation_private: this.state.privatePostCreation,
      view_privacy: this.state.viewPrivacy,
      categories: this.state.categoryIDs
    }).then(response => {
      if (response.statusText === "success") {
        this.handleCloseModal();
      }
    });
  }

  scrollForm(e) {
    e.preventDefault();
    const el = document.getElementById("firstCreatePage");
    const width = el.offsetWidth;
    el.scrollLeft += width;
  }

  typedCategory(e) {
    if (
      e.nativeEvent.target.value === "" ||
      e.nativeEvent.target.value === null ||
      e.nativeEvent.target.value.length === 0
    ) {
      this.suggestionBoxRef.current.style.display = "none";
    } else {
      this.suggestionBoxRef.current.style.display = "block";
      this.searchInterest(e.nativeEvent.target.value);
    }
  }

  categoryClicked(category) {
    this.setState(prevState => ({
      selectedCategories: [...prevState.selectedCategories, category],
      categoryIDs: [...prevState.categoryIDs, category.id]
    }));
    this.suggestionBoxRef.current.style.display = "none";
    this.categorySearchInputRef.current.value = "";
  }

  removeCategory(category) {
    this.setState({
      selectedCategories: this.state.selectedCategories.filter(function(selectedCategory) {
        return selectedCategory.id !== category.id;
      })
    });
  }

  getInterests() {
    GetRequest(API_GET_INTERESTS_LIST).then(response => {
      if (response.statusText !== "error") {
        this.setState({
          categories: response.result.data
        });
      }
    });
  }

  searchInterest(keyword) {
    GetRequest(API_SEARCH_INTERESTS_LIST, {
      query: keyword
    }).then(response => {
      if (response.statusText !== "error") {
        this.setState({
          categorySearchResults: response.result
        });
      }
    });
  }

  render() {
    let buttonClass = "blocked-btn";
    if (
      this.state.groupName.length !== null &&
      this.state.groupName.length <= 170 &&
      (this.state.email !== "" && this.state.emailError === "")
    ) {
      buttonClass = "btn-highlight";
    } else {
      buttonClass = "blocked-btn";
    }
    return (
      <div className="community-wrapper">
        {!this.state.loadedGroups ? (
          <div className="community-loader">
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
        ) : (
          this.state.groups.length === 0 &&
          (this.props.currentCommunity ? (
            <div className="community-loader">
              <img style = {{ display: "block", margin: "auto", width: "100px"}} src={Spinner} alt="" />
            </div>) : 
            (<div className="no-community">
              <h1>Community Hub</h1>
              <p>
                Here you will find all the communities you{" "}
                <button onClick={this.handleOpenModal.bind(this)}>
                  create
                </button>{" "}
                or <button>join</button>
              </p>
            </div>))
        )}
        {this.state.groups.length > 0 && (
          <div className="community-grid">
            <CommunitySidePanel handleOpenModal={this.handleOpenModal.bind(this)}
              groups={this.state.groups}
              currentCommunity={this.state.currentCommunity}
              params={this.props.match.params}
              history={this.props.history}/>
            {this.state.communityDetails && (
              <CommunityMainBody history={this.props.history}
                short_name={this.state.shortName}
                getAllUserGroups={this.getAllUserGroups.bind(this)}
                postId={this.props.match.params.postId}
                subMenu={this.props.match.params.sub}
                params={this.props.match.params}
                communityDetails={this.state.communityDetails}/>
            )}
            
          </div>
        )}
        <ReactModal isOpen={this.state.showModal} contentLabel="Create Group"
          overlayClassName="create-group-overlay"
          className="create-group-modal">
          <button onClick={this.handleCloseModal.bind(this)}
            className="cancel-btn">
            <img src={cancelIcon} alt="close" color="#EA6161" />
          </button>
          <form className="create-group-flex" method="post">
            <div id="firstCreatePage">
              <div>
                <p>Create new community</p>
                <div className="form-input">
                  <p>Group Name</p>
                  <input className="line-input" type="text" name="groupName" onChange={this.handleChange.bind(this)}/>
                  {this.state.groupNameError !== "" && (
                    <p className="error-message blue" id="groupNameError">
                      {this.state.groupNameError}
                    </p>
                  )}
                </div>

                <div className="form-input">
                  <p>Group Email Address</p>
                  <input className="line-input" type="email" name="email"
                    onChange={this.handleChange.bind(this)}/>
                  {this.state.emailError !== "" && (
                    <p className="error-message">{this.state.emailError}</p>
                  )}
                </div>

                <button className={buttonClass} onClick={this.scrollForm.bind(this)}>
                  Next
                </button>
              </div>

              <div>
                <p>Set group permissions</p>
                <div className="form-input">
                  <p>Who can view this group?</p>
                  <select className="line-select" name="viewPrivacy" onChange={this.handleChange.bind(this)}>
                    <option selected disabled value="">
                      select
                    </option>
                    <option value="private">
                      Private - Only invited members can view/join the group
                    </option>
                    <option value="public">
                      Public - Anyone can view/join the group
                    </option>
                  </select>
                </div>

                <div className="form-input">
                  <p className="black">Who can post on this group?</p>
                  <label class="container">
                    <input type="radio" defaultChecked={true} name="postPrivilege" value={true}
                      onChange={this.postPrivacyChange.bind(this)}/>
                    <p>Only group admins</p>
                    <span class="checkmark"></span>
                  </label>

                  <label class="container">
                    <input type="radio" name="postPrivilege" value={false}
                      onChange={this.postPrivacyChange.bind(this)}/>
                    <p>Members and group admins</p>
                    <span class="checkmark"></span>
                  </label>
                </div>

                <button className={buttonClass} onClick={this.scrollForm.bind(this)}>
                  Next
                </button>
              </div>

              <div className="suggestions">
                <p>Categories</p>
                <div className="form-input category-suggestions">
                  <input type="text" name="categories" className="box-input" autoComplete="off"
                    placeholder="Start typing to see categories"
                    onChange={this.typedCategory.bind(this)}
                    ref={this.categorySearchInputRef}/>
                  <div className="suggestions-box" ref={this.suggestionBoxRef}>
                    {this.state.categorySearchResults.map((category, index) => (
                      <p key={index} onClick={this.categoryClicked.bind(this, category)}>
                        {category.name}
                      </p>
                    ))}
                  </div>
                  <div className="selected-categories">
                    {this.state.selectedCategories.map((category, index) => (
                      <div  key={index}>
                        <p>{category.name}</p>
                        <p onClick={this.removeCategory.bind(this, category)}>
                          X
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className={buttonClass} onClick={this.createNewGroup.bind(this)}>
                  Create
                </button>
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatch = dispatch => {
  return {
    changeCommunity: community => {
      dispatch(ChangeCommunity(community));
    }
  };
};

export default connect(mapStateToProps, mapDispatch)(CommunityComponent);