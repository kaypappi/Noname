import React, { Component } from "react";
import "./incomingChat.css";
import moment from "moment";

export default class incomingChat extends Component {
  render() {
    return (
      <div key={this.props.index} className="incoming-chat-wrapper flex  mb-2">
        <div className="incoming-chat shadow-sm py-2 px-3">
          <p className="text-sm  text-blue-800 font-semibold">
            {this.props.fullName}
          </p>
          <p className="text-xs break-words ">{this.props.chat.message}</p>
          <p
            style={{ fontSize: "8px" }}
            className="text-left  text-grey-dark mt-1"
          >
            {moment(this.props.chat.timestamp.toDate()).format("LT")}
          </p>
        </div>
      </div>
    );
  }
}
