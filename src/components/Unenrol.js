/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { UNENROL_MUTATION } from "../queries";
import { withToastManager } from "react-toast-notifications";
import Spinner from "./Spinner";

class Unenrol extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const { id } = this.props;
    const { loading } = this.state;

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
        <small>Are you sure?</small>
        <Mutation
          mutation={UNENROL_MUTATION}
          onCompleted={this._success}
          onError={this._announceError}
          update={this._success}
          variables={{ id }}
        >
          {mutation => {
            return (
              <input
                type="button"
                value="Yes, unenroll me from this class"
                className="warning"
                onClick={() => {
                  this.setState({ loading: true });

                  mutation();
                }}
              />
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
    const { toastManager, onCompleted } = this.props;

    mixpanel.track("Unenrolled from class");

    this.setState({ loading: false });
    toastManager.add("You have been unenrolled", {
      appearance: "success",
      autoDismiss: true
    });

    if (onCompleted) onCompleted();
  };
}

export default withToastManager(Unenrol);
