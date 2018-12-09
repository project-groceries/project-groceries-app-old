/* global mixpanel */
import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { withRouter } from "react-router";
import {
  CREATE_CLASS_QUERY,
  CREATE_CLASS_MUTATION,
  USER_QUERY
} from "../queries";
import { css } from "emotion";
import Button from "@atlaskit/button";
import { FieldTextStateless } from "@atlaskit/field-text";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

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
            <FlagContext.Consumer>
              {({ addFlag }) => (
                <Mutation
                  mutation={CREATE_CLASS_MUTATION}
                  refetchQueries={[{ query: USER_QUERY }]}
                  onCompleted={data => this._success(data, addFlag)}
                  onError={error => this._announceError(error, addFlag)}
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
                        <h2>
                          Create {classes.length ? "a" : "your first"} class
                        </h2>
                        <FieldTextStateless
                          label="Class Name"
                          onChange={e =>
                            this.setState({ name: e.target.value })
                          }
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
              )}
            </FlagContext.Consumer>
          );
        }}
      </Query>
    );
  }

  _announceError = async (error, addFlag) => {
    addFlag({
      type: "error",
      title: "Uh oh!",
      description:
        "There seems to have been an error. We'll try to get this sorted ASAP."
    });
  };

  _success = async ({ createClass: { id } }, addFlag) => {
    const { history, onCompleted } = this.props;

    mixpanel.track("Created class");

    addFlag({
      type: "success",
      title: "Class created successfully",
      description: changesNotice
    });

    history.push(`/classes/${id}`);
    if (onCompleted) onCompleted();
  };
}

export default withRouter(CreateClass);
