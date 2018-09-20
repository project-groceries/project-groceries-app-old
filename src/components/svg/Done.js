import React, { Component } from "react";

class Done extends Component {
  render() {
    return (
      <svg
        onClick={this.props.onClick}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill={this.props.fill}
          d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
        />
      </svg>
    );
  }
}

export default Done;
