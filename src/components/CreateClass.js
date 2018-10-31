/* global mixpanel */
import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import { CREATE_CLASS_QUERY, CREATE_CLASS_MUTATION } from "../queries";
import { css } from "emotion";
import Button from "@atlaskit/button";
import { FieldTextStateless } from "@atlaskit/field-text";

class CreateClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  render() {
    const { name } = this.state;

    return (
      <Query query={CREATE_CLASS_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div id="spinner" className="card">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </div>
            );
          if (error) return <span>Error</span>;

          const { classes } = data.user;

          return (
            <Mutation
              mutation={CREATE_CLASS_MUTATION}
              onCompleted={this._success}
              // onError={this._announceError}
              // update={this._success}
            >
              {(mutation, { loading }) => {
                return (
                  <div
                    className={css`
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;

                      & > * {
                        margin: 7px;
                      }
                    `}
                  >
                    <h2>Create {classes.length ? "a" : "your first"} class</h2>
                    <FieldTextStateless
                      label="Class Name"
                      onChange={e => this.setState({ name: e.target.value })}
                      value={name}
                      required
                      placeholder="Year 8 Home Ec"
                    />
                    <Button
                      appearance="primary"
                      onClick={() => {
                        if (name) {
                          mutation({ variables: { name } });
                        }
                      }}
                      isLoading={loading}
                    >
                      Create Class
                    </Button>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }

  _announceError = async () => {
    const { toastManager } = this.props;

    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async ({ createClass: { id } }) => {
    const { history, toastManager, onCompleted } = this.props;

    mixpanel.track("Created class");

    toastManager.add("Class created successfully", {
      appearance: "success",
      autoDismiss: true
    });

    history.push(`/classes/${id}`);
    if (onCompleted) onCompleted();
  };
}

export default withToastManager(withRouter(CreateClass));
