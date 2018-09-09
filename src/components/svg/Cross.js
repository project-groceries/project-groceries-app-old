import React, { Component } from "react";

class Cross extends Component {
  render() {
    return (
      <svg
        onClick={this.props.onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 55.324 55.321"
      >
        <path d="M47.393 0L27.677 19.709 8.531.563.602 8.491l19.15 19.144L0 47.387l7.931 7.934 19.746-19.749 19.15 19.146 7.925-7.928-19.147-19.155 19.719-19.71z" />
      </svg>
    );
  }
}

export default Cross;
