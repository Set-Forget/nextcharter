import React, { Component } from "react";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";

function Option(props) {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null} // No operation, as selection is handled by ReactSelect
        style={{
          marginRight: "10px", // Margin between checkbox and label
          borderRadius: "4px", // Border radius for checkbox
        }}
      />
      <label>{props.label}</label>
    </components.Option>
  );
}

export default class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionSelected: null,
    };
  }

  handleChange = (selectedOptions) => {
    this.props.setSelectedCompetenciesState(
      selectedOptions.map((opt) => opt.value)
    );
  };

  render() {
    const { studentRegister, selectedCompetencies, student } = this.props;

    const options = studentRegister.map((item) => ({
      label: item.competency_name,
      value: item.competency_id,
    }));

    const selectedValues = options.filter((option) =>
      selectedCompetencies.includes(option.value)
    );

    const nonOptions = [];

    const customStyles = {
      control: (provided) => ({
        ...provided,
        backgroundColor: "white",
        borderColor: "gray",
        borderRadius: "0.375rem", // Tailwind rounded-md
        // padding: "0.5rem", // Tailwind px-4, py-2
        height: "40px", // Set height
        outline: "none",
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.05)", // Tailwind ring-1, ring-gray-300
        ":hover": {
          borderColor: "indigo", // Tailwind focus:outline-indigo-600
        },
        ":focus": {
          boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.5)", // Tailwind focus:drop-shadow-2xl
        },
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "#71717a", // Set your desired color for the 'x' button
        ":hover": {
          color: "#71717a", // Set your desired hover color for the 'x' button
        },
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#71717a", // Set your desired color for the arrow
        ":hover": {
          color: "#71717a", // Set your desired hover color for the arrow
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "transparent text-black"
          : "white text-black",
        color: state.isSelected ? "black" : "default", // Set text color for selected options
        ":active": {
          backgroundColor: state.isSelected ? "transparent" : "white",
          color: state.isSelected ? "black" : "default", // Set text color for active (clicked) options
        },
      }),
      multiValue: (provided) => ({
        ...provided,
        alignItems: "center", // Align items inside the box vertically
        display: "flex", // Ensure the content inside the box is flex
      }),
      placeholder: (provided) => ({
        ...provided,
        fontSize: "15.5px",
        color: "#71717a",
      }),
      // Additional custom styles as needed
    };

    return (
      <span
        className="d-inline-block"
        data-toggle="popover"
        data-trigger="focus"
        data-content="Please select competencies"
      >
        <ReactSelect
          placeholder={"Select competencies"}
          options={student != "" ? options : nonOptions} // Pass the mapped options here
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option }} // Use your custom Option component
          onChange={this.handleChange}
          value={selectedValues}
          styles={customStyles}
        />
      </span>
    );
  }
}
