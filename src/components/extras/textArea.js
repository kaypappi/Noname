import React, { Component } from "react";
import "./textArea.css";

export default class textArea extends Component {
  state = {
    textValue: "",
    value: "",
    rows: 1,
    minRows: 1,
    maxRows: 10,
  };

  handleChange = (event) => {
    const textareaLineHeight = 24;
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });

    //event.target.rows = minRows;
  };

  componentDidUpdate(prevProps,prevState){
    if(this.props.value !== prevProps.value && this.props.value===""){
      this.setState({
        rows:1
      })
    } 
  }

  componentDidMount() {}

  render() {
    return (
      <div className="textarea-wrapper">
        <div className="textarea-container">
          <textarea
            id="textarea"
            className="textarea"
            rows={this.state.rows}
            //data-min-rows="1"
            value={this.props.value}
            placeholder={this.props.placeHolder}
            onChange={(e) => {
              this.handleChange(e);
              this.props.handleText(e);
            }}
          ></textarea>
        </div>
      </div>
    );
  }
}
