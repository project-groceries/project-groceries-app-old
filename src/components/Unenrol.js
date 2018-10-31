/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { UNENROL_MUTATION } from "../queries";
import { withToastManager } from "react-toast-notifications";
import Button from "@atlaskit/button";

class Unenrol extends Component {
  render() {
    const { id } = this.props;

    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          & > * {
            margin: 10px;
          }
        `}
      >
        <small>Are you sure?</small>
        <Mutation
          mutation={UNENROL_MUTATION}
          onCompleted={this._success}
          // onError={this._announceError}
          // update={this._success}
          variables={{ id }}
        >
          {(mutation, { loading }) => {
            return (
              <Button
                appearance="warning"
                isLoading={loading}
                onClick={() => {
                  mutation();
                }}
              >
                Yes, unenroll me from this class
              </Button>
            );
          }}
        </Mutation>
      </div>
    );
  }

  _announceError = async () => {
    const { toastManager } = this.props;

    this.setState({ loading: false });
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async () => {
    const { history, toastManager, onCompleted } = this.props;

    mixpanel.track("Unenrolled from class");

    this.setState({ loading: false });
    toastManager.add("You have been unenrolled", {
      appearance: "success",
      autoDismiss: true
    });

    history.push("/");
    if (onCompleted) onCompleted();
  };
}

export default withToastManager(withRouter(Unenrol));
