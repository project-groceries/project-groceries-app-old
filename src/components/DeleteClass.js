/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { DELETE_CLASS_MUTATION } from "../queries";
import { withToastManager } from "react-toast-notifications";
import Spinner from "./Spinner";

class DeleteClass extends Component {
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
        <small>Are you sure? This action cannot be undone.</small>
        <Mutation
          mutation={DELETE_CLASS_MUTATION}
          onCompleted={this._success}
          onError={this._announceError}
          update={this._success}
          variables={{ id }}
        >
          {mutation => {
            return (
              <input
                type="button"
                value="Yes, delete this class"
                className="error"
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

    mixpanel.track("Deleted a class");

    this.setState({ loading: false });
    toastManager.add("Class successfully deleted", {
      appearance: "success",
      autoDismiss: true
    });

    if (onCompleted) onCompleted();
  };
}

export default withToastManager(DeleteClass);
