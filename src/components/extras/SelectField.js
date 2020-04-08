import React, { Component } from "react";
import Select, { components } from "react-select";
//import { colourOptions } from "../data";
import { allOptions, OptionContext } from "avataaars";

const ValueContainer = ({ children, ...props }) => (
  <components.ValueContainer {...props}>{children}</components.ValueContainer>
);

export default class SelectField extends Component {
  state = {
    selectedOption: null,
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  /* displayJson = list => {
    let newList = [];
    let options = [];

    let list2 = list.split(" ").filter(d => d !== "");
    list2.map((item, index) => {
      if (index !== list2.length - 1) {
        newList = [...newList, item.slice(0, item.length - 1)];
      } else {
        newList = [...newList, item];
      }
    });
    console.log(newList);
    newList.map(item => {
      const newObj = { value: item, label: item };
      options = [...options, newObj];
    });

    console.log(options);
  }; */

  componentDidMount() {}

  render() {
    return (
      <div>
        <Select
          defaultValue={this.props.defaultValue}
          /* isClearable */
          onChange={(e) => {
            this.props.handleSelect(e, this.props.item.label);
          }}
          styles={{
            singleValue: (base) => ({ ...base, color: "white" }),
            valueContainer: (base) => ({
              ...base,
              background: " #3fa0b5",
              color: "white",
              width: "100%",
            }),
          }}
          components={{ ValueContainer }}
          /* isSearchable */
          name="color"
          options={this.props.options}
        />
      </div>
    );
  }
}
