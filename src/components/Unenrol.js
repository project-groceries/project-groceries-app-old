/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router";
import { UNENROL_MUTATION, CLASSES_GRID_QUERY } from "../queries";
import Button from "@atlaskit/button";

import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

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
              refetchQueries={[{ query: CLASSES_GRID_QUERY }]}
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
    addFlag({
      type: "error",
      title: "Uh oh!",
      description:
        "There seems to have been an error. We'll try to get this sorted ASAP."
    });
  };

  _success = addFlag => {
    const { history, onCompleted } = this.props;

    mixpanel.track("Unenrolled from class");

    addFlag({
      type: "success",
      title: "Successfully Unenrolled",
      description: changesNotice
    });

    history.push("/");
    if (onCompleted) onCompleted();
  };
}

export default withRouter(Unenrol);
