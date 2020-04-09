import React, { Component } from "react";
import moment from 'moment'
import "./outgoingChat.css";

export default class outgoingChat extends Component {
  render() {
    return (
      <div key={this.props.index} className="flex justify-end mb-2">
        <div className="outgoing-chat shadow-sm py-2 px-3">
          <p className="text-sm text-right text-blue-800 font-semibold">
            You
          </p>
          <p className="text-xs text-right mt-1">{this.props.chat.message}</p>
          <p style={{fontSize:'8px'}} class="text-grey-dark mt-1">{moment(this.props.chat.timestamp.toDate()).format('LT')}</p>
        </div>
      </div>
    );
  }
}
