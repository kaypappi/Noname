import React, { Component } from "react";
import './input.css'

export default class Input extends Component {
    state={
        
    }
  render() {
    const {
      name,
      type,
      placeholder,
      onChange,
      className,
      value,
      error,
      children,
      label,
      ...props
    } = this.props;

    const label2 = this.props.value ? ['input-label','active']: ['input-label']

    return (
      <div className='input-wrapper'>
        <label className={label2.join(' ')} htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={className}
          style={error && { border: "solid 1px red" }}
        />
        {error && <p>{error}</p>}
      </div>
    );
  }
}

Input.defaultProps = {
  type: "text",
  className: ""
};
