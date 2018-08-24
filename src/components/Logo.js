import React, { Component } from "react";

class Logo extends Component {
  render() {
    return (
      <svg
        className="favicon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 550 550"
        fill="#83c673"
      >
        <path
          className="handle"
          d="M275 79.2a81.2 81.2 0 0 1 81.2 81.2h22.3a103.5 103.5 0 1 0-207 0h22.3A81.2 81.2 0 0 1 275 79.2z"
        />
        <path className="bag" d="M39.3 493.1h471.3V160.4H39.3" />
      </svg>
    );
  }
}

export default Logo;
