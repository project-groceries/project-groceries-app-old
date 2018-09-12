import React, { Component } from "react";
import { css } from "emotion";

class DeleteClass extends Component {
  render() {
    return (
      <div
        className={css`
          text-align: center;
        `}
      >
        <small>Are you sure? This action cannot be undone.</small>
        <input
          type="button"
          value="Yes, delete this class"
          className="warning"
          // onClick={this._toggleUnenrolModal}
        />
      </div>
    );
  }
}

export default DeleteClass;
