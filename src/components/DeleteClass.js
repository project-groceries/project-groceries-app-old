/* global mixpanel */

import React, { Component } from "react";
import { css } from "emotion";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router";
import {
  DELETE_CLASS_MUTATION,
  CLASSES_GRID_QUERY,
  ORDER_CAROUSEL_QUERY
} from "../queries";
import Button from "@atlaskit/button";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";

class DeleteClass extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id } = this.props;

    return (
      <FlagContext.Consumer>
        {({ addFlag }) => (
          <Mutation
            mutation={DELETE_CLASS_MUTATION}
            refetchQueries={[
              { query: CLASSES_GRID_QUERY },
              { query: ORDER_CAROUSEL_QUERY }
            ]}
            onCompleted={() => this._success(addFlag)}
            variables={{ id }}
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
                      margin: 10px;
                    }
                  `}
                >
                  <small>Are you sure? This action cannot be undone.</small>
                  <Button
                    appearance="danger"
                    isLoading={loading}
                    onClick={() => {
                      mutation();
                    }}
                  >
                    Yes, delete this class
                  </Button>
                </div>
              );
            }}
          </Mutation>
        )}
      </FlagContext.Consumer>
    );
  }

  _success = addFlag => {
    const { history, onCompleted } = this.props;

    mixpanel.track("Deleted a class");

    addFlag({
      type: "success",
      title: "Class successfully deleted",
      description: changesNotice
    });

    history.push("/");
    if (onCompleted) onCompleted();
  };
}

export default withRouter(DeleteClass);
