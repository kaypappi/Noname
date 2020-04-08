import React, { Component } from "react";
import "./CommunitySidePanelComponent.css";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { GetRequest } from "../../Helpers/request";
import API from "../../Constants/api_routes";
import SubscribeToCommunityNotifications from "../../Utils/SocketActions/SubscribeToCommunityNotifications";

class CommunitySidePanel extends Component {
  state = {
    total_notification_count: 0,
    old_notification_count: 0,
    groupsNotifications: {}
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    let prevLength = 0,
      newLength = 0;
    Object.values(prevProps.notifications).forEach(key => {
      prevLength = prevLength + key.length;
    });
    Object.values(this.props.notifications).forEach(key => {
      newLength = newLength + key.length;
    });
    if (newLength !== prevLength) {
      this.getNotificationCount(this.props.notifications,newLength);
    }
  }

  getNotificationCount = (notifications,newLength) => {
    this.setState(
      {
        groupsNotifications: {}
      },
      () => {
        Object.values(notifications).forEach(key => {
          key.map(item => {
            
            if (this.state.groupsNotifications[item.community.short_name]) {
              let newGroup = { ...this.state.groupsNotifications };
              newGroup[item.community.short_name] =
                this.state.groupsNotifications[item.community.short_name] + 1;
              return this.setState({
                groupsNotifications: newGroup
              });
            } else {
              let newGroup = { ...this.state.groupsNotifications };
              newGroup[item.community.short_name] = newLength;
              
              return this.setState({
                groupsNotifications: newGroup
              });
            }
          });
        }); 
      }
    );
  };

  handleClick = short_name => {
    this.props.history.push(`/${short_name}/feeds`);
  };
  render() {
    return (
      <div className="community-side-panel">
        <p>My Communities</p>
        {this.props.groups.length > 0 && (
          <ul className="community-list">
            {this.props.groups.map((group, index) => {
              setTimeout(
                () => SubscribeToCommunityNotifications.message(group.id),
                Math.random() * 1000
              );
              return (
                <div
                  className={
                    "list " +
                    `${
                      this.props.params.id === group.short_name
                        ? "is-active"
                        : ""
                    }`
                  }
                  onClick={() => {
                    this.handleClick(group.short_name);
                  }}
                  key={index}
                >
                  <li className="community" key={index}>
                    <div>
                      {this.state.groupsNotifications[group.short_name] && (
                        <span className="badge">
                          {this.state.groupsNotifications[group.short_name]}
                        </span>
                      )}
                    </div>
                    <p>{group.name}</p>
                  </li>
                </div>
              );
            })}
          </ul>
        )}

        <button className="new-group" onClick={this.props.handleOpenModal}>
          Create new group <span className="fas fa-plus"></span>
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(CommunitySidePanel);
