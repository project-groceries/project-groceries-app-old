/* global mixpanel */
import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import { CREATE_CLASS_QUERY, CREATE_CLASS_MUTATION } from "../queries";
import { css } from "emotion";
import Spinner from "./Spinner";

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
              {(mutation, { loading, error }) => {
                return loading ? (
                  <Spinner />
                ) : (
                  <form
                    className={css`
                      text-align: center;

                      & > * {
                        padding: 7px;
                      }
                    `}
                    onSubmit={e => {
                      e.preventDefault();
                      this.setState({});

                      if (name) {
                        mutation({ variables: { name } });
                      }
                    }}
                  >
                    <h2>Create {classes.length ? "a" : "your first"} class</h2>
                    <div className="form__group">
                      <label htmlFor="name">Class Name</label>
                      <input
                        id="name"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="Year 8 Home Ec"
                        required={true}
                      />
                    </div>
                    <button type="submit" className="btn info">
                      Create Class
                    </button>
                  </form>
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
