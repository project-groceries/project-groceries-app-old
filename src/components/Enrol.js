/* global mixpanel */

import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { Query, Mutation } from "react-apollo";
import Select from "react-select";
import { ENROL_QUERY, ENROL_INTO_CLASS_MUTATION, USER_QUERY } from "../queries";

import Button from "@atlaskit/button";
import { css } from "emotion";

import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

class Enrol extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <Query query={ENROL_QUERY}>
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

          const { enrolledIn, school } = data.user;
          const { users: teachers } = school;
          const allClasses = teachers.reduce(
            (prev, cur) => [...prev, ...cur.classes],
            []
          );
          const unenrolledClasses = allClasses.filter(
            c => !enrolledIn.some(ec => ec.id === c.id)
          );
          const options = unenrolledClasses.map(c => ({
            value: c.id,
            label: c.name
          }));

          return allClasses.length ? (
            unenrolledClasses.length ? (
              <FlagContext.Consumer>
                {({ addFlag }) => (
                  <Mutation
                    mutation={ENROL_INTO_CLASS_MUTATION}
                    refetchQueries={[{ query: USER_QUERY }]}
                    onCompleted={() => this._success(addFlag)}
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
                          <Fragment>
                            <div className="form__group">
                              <Select
                                onChange={this._handleChange}
                                options={options}
                                autoFocus={true}
                                aria-label="Select a class"
                                placeholder="Select a class"
                                maxMenuHeight={100}
                              />
                            </div>
                            <Button
                              appearance="primary"
                              onClick={() => {
                                if (selectedOption) {
                                  const { value } = selectedOption;
                                  this.setState({
                                    mutationLoading: true
                                  });
                                  mutation({ variables: { id: value } });
                                }
                              }}
                              isLoading={loading}
                            >
                              Enrol into class
                            </Button>
                          </Fragment>
                        </div>
                      );
                    }}
                  </Mutation>
                )}
              </FlagContext.Consumer>
            ) : (
              <p>There are no other classes to enrol into.</p>
            )
          ) : (
            <p>
              It seems there are no classes to enrol into yet.
              <span role="img" aria-label="shrug emoji">
                🤷
              </span>
            </p>
          );
        }}
      </Query>
    );
  }

  _handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  _success = addFlag => {
    mixpanel.track("Enrolled into class");

    const { onCompleted, history } = this.props;
    const { selectedOption } = this.state;

    addFlag({
      type: "success",
      title: "Successfully Enrolled",
      description: changesNotice
    });

    history.push(`/classes/${selectedOption.value}`);
    if (onCompleted) onCompleted();
  };
}

export default withRouter(Enrol);
