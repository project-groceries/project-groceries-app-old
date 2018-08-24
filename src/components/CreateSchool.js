import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { CREATE_SCHOOL_MUTATION, USER_QUERY } from "../queries";

class CreateSchool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      teacherCode: "",
      success: false,
      error: false,
      loading: false
    };
  }

  render() {
    const { name, teacherCode, success, error, loading } = this.state;

    return (
      <Fragment>
        {error ? (
          <small id="incorrect" className="card warning">
            Incorrect Details
          </small>
        ) : (
          ""
        )}

        {loading ? (
          <div id="spinner" className="card">
            <div className="spinner">
              <div className="bounce1" />
              <div className="bounce2" />
              <div className="bounce3" />
            </div>
          </div>
        ) : (
          ""
        )}

        <Mutation
          mutation={CREATE_SCHOOL_MUTATION}
          variables={{ name, teacherCode }}
          onCompleted={data => this._confirm(data)}
          onError={error => this._announceError(error)}
          update={(cache, { data: { createSchool } }) => {
            const { user } = cache.readQuery({ query: USER_QUERY });
            cache.writeQuery({
              query: USER_QUERY,
              data: {
                user: { ...user, school: createSchool }
              }
            });
          }}
        >
          {mutation =>
            success ? (
              <div id="correct" className="card column">
                <h1>
                  <span role="img" aria-label="Thumbs Up">
                    👍
                  </span>
                </h1>
                <small>Boo Yah</small>
              </div>
            ) : (
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
                  <label htmlFor="name">School Name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={e => this.setState({ name: e.target.value })}
                    type="text"
                    placeholder="First Last"
                    required={true}
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="password">Teacher Code</label>
                  <input
                    id="teacherCode"
                    value={teacherCode}
                    onChange={e =>
                      this.setState({ teacherCode: e.target.value })
                    }
                    type="password"
                    placeholder="******"
                    required={true}
                  />
                  <small>ⓘ Code used to validate teachers.</small>
                </div>
                <button type="submit" className="btn info">
                  Create School
                </button>
              </form>
            )
          }
        </Mutation>
      </Fragment>
    );
  }

  _announceError = async () => {
    this.setState({ error: true, loading: false });
  };

  _confirm = async () => {
    this.setState({ success: true, loading: false });
  };
}

export default CreateSchool;
