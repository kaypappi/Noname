import React, { Component } from "react";
import './Alert.css'

const mql = window.matchMedia(`(min-width: 800px)`);


export default class Alert extends Component {
  render() {
    return (
      <div>
        {this.props.show && (
          <div
            style={{
              position: mql? 'absolute': 'fixed',
              maxWidth: "150px",
              top: "50px",
              zIndex:'7'
            }}
            className={`bg-green-100 opacity-0 text-center mx-auto left-0 right-0 border border-green-400 text-green-700 px-1 py-2 rounded alert ${this.props.show ? 'active':''}  `}
            role="alert"
          >
            <span className="block sm:inline">{this.props.message}</span>
          </div>
        )}
      </div>
    );
  }
}
