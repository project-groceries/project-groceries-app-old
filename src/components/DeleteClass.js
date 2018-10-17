/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import { DELETE_CLASS_MUTATION } from "../queries";
import Spinner from "./Spinner";

class DeleteClass extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id } = this.props;

    return (
      <Mutation
        mutation={DELETE_CLASS_MUTATION}
        onCompleted={this._success}
        // onError={this._announceError}
        // update={this._success}
        variables={{ id }}
      >
        {(mutation, { loading }) => {
          return loading ? (
            <Spinner />
          ) : (
            <div
              className={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              `}
            >
              <small>Are you sure? This action cannot be undone.</small>
              <input
                type="button"
                value="Yes, delete this class"
                className="error"
                onClick={() => {
                  mutation();
                }}
              />
            </div>
          );
        }}
      </Mutation>
    );
  }

  _announceError = async () => {
    const { toastManager } = this.props;

    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async () => {
    const { history, toastManager, onCompleted } = this.props;

    mixpanel.track("Deleted a class");

    toastManager.add("Class successfully deleted", {
      appearance: "success",
      autoDismiss: true
    });

    history.push("/classes");
    if (onCompleted) onCompleted();
  };
}

export default withToastManager(withRouter(DeleteClass));
