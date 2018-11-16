/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { UNENROL_MUTATION } from "../queries";
import { withToastManager } from "react-toast-notifications";
import Button from "@atlaskit/button";

import { FlagContext } from "../flag-context";

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
        <FlagContext.Consumer>
          {({ addFlag }) => (
            <Mutation
              mutation={UNENROL_MUTATION}
              onCompleted={() => this._success(addFlag)}
              onError={error => this._announceError(error, addFlag)}
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
          )}
        </FlagContext.Consumer>
      </div>
    );
  }

  _announceError = (error, addFlag) => {
    const { toastManager } = this.props;

    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
    addFlag({
      type: "error",
      title: "Uh oh!",
      description:
        "There seems to have been an error. We'll try to get this sorted ASAP."
    });
  };

  _success = addFlag => {
    const { history, toastManager, onCompleted } = this.props;

    mixpanel.track("Unenrolled from class");

    toastManager.add("You have been unenrolled", {
      appearance: "success",
      autoDismiss: true
    });

    addFlag({
      type: "success",
      title: "Unenrolled",
      description:
        "You have been unenrolled. Changes may take a few seconds to be reflected on the page."
    });

    history.push("/");
    if (onCompleted) onCompleted();
  };
}

export default withToastManager(withRouter(Unenrol));
