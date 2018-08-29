import React, { Component } from "react";

class Spinner extends Component {
  render() {
    return (
      <div id="spinner" className="card">
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      </div>
    );
  }
}

export default Spinner;
