import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import {
  JOIN_SCHOOL_MUTATION,
  FIND_SCHOOLS_QUERY,
  USER_QUERY
} from "../queries";

class JoinSchool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false,
      error: false,
      loading: false
    };
  }

  render() {
    const { success, error, loading } = this.state;

    return (
      <Fragment>
        {error ? (
          <small id="incorrect" className="card warning">
            An error occurred.
          </small>
        ) : (
          ""
        )}{" "}
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
          mutation={JOIN_SCHOOL_MUTATION}
          onCompleted={this._confirm}
          onError={this._announceError}
          update={(cache, { data: { joinSchool } }) => {
            const { user } = cache.readQuery({ query: USER_QUERY });
            cache.writeQuery({
              query: USER_QUERY,
              data: {
                user: { ...user, school: joinSchool }
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
                  const id = e.target.schoolId.value;
                  this.setState({
                    id,
                    success: false,
                    error: false,
                    loading: true
                  });
                  mutation({ variables: { id } });
                }}
              >
                <Query query={FIND_SCHOOLS_QUERY}>
                  {({ loading, error, data }) => {
                    if (loading) return <p>Loading schools...</p>;
                    if (error)
                      return (
                        <p style={{ color: "red" }}>
                          There was an error finding your school
                        </p>
                      );

                    const { schools } = data;

                    return schools.length ? (
                      <Fragment>
                        <div className="form__group">
                          <label htmlFor="schoolId">Select your school</label>
                          <select
                            id="schoolId"
                            defaultValue={schools[0].id}
                            required={true}
                          >
                            {schools.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn info">
                          Join School
                        </button>
                      </Fragment>
                    ) : (
                      <p>There are no schools at the moment</p>
                    );
                  }}
                </Query>
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

  _confirm = async data => {
    console.log("datum bro", data);
    this.setState({ success: true, loading: false });
  };
}

export default JoinSchool;
