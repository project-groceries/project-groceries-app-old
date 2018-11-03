/* global mixpanel */

import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { withToastManager } from "react-toast-notifications";
import { CREATE_SCHOOL_MUTATION, USER_QUERY } from "../queries";

class CreateSchool extends Component {
  state = {
    name: "",
    loading: false
  };

  render() {
    const { name, loading } = this.state;

    return (
      <Fragment>
        {loading && (
          <div id="spinner" className="card">
            <div className="spinner">
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
          </div>
        )}

        <Mutation
          mutation={CREATE_SCHOOL_MUTATION}
          variables={{ name }}
          update={data => this._success(data)}
          onCompleted={data => this._success(data)}
          onError={error => this._announceError(error)}
          update={(cache, { data: { createSchool } }) => {
            const { user } = cache.readQuery({ query: USER_QUERY });
            cache.writeQuery({
              query: USER_QUERY,
              data: {
                user: {
                  ...user,
                  type: "TEACHER",
                  hasDeclaredAccountType: true,
                  school: createSchool
                }
              }
            });
          }}
        >
          {mutation => (
            <form
              onSubmit={e => {
                e.preventDefault();
                this.setState({
                  success: false,
                  error: false,
                  loading: true
                });
                mutation();
              }}
            >
              <div className="form__group">
                <label htmlFor="schoolName">School Name</label>
                <input
                  id="schoolName"
                  value={name}
                  onChange={e => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="First Last"
                  required={true}
                />
              </div>
              <button type="submit" className="btn info">
                Create School
              </button>
            </form>
          )}
        </Mutation>
      </Fragment>
    );
  }

  _announceError = async error => {
    const { toastManager } = this.props;

    // eslint-disable-next-line
    console.log("error", error);

    this.setState({ loading: false });
    toastManager.add("An error occurred", {
      appearance: "error",
      autoDismiss: true
    });
  };

  _success = async () => {
    const { toastManager } = this.props;

    mixpanel.track("Created school");

    this.setState({ loading: false });
    toastManager.add("🏫 Boo Yah! You have successfully created a school", {
      appearance: "success",
      autoDismiss: true
    });
  };
}

export default withToastManager(CreateSchool);
