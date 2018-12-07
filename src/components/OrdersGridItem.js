import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_ORDER_MUTATION, DELETE_ORDER_MUTATION } from "../queries";
import { orderItem } from "../styles";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";
import Button from "@atlaskit/button";
import { Delete, Edit, Close, Done } from "styled-icons/material";
import styled from "styled-components";

const DeleteIcon = styled(Delete)`
  width: 24px;
`;
const EditIcon = styled(Edit)`
  width: 24px;
`;
const CloseIcon = styled(Close)`
  width: 24px;
`;
const DoneIcon = styled(Done)`
  width: 24px;
`;

class OrdersGridItem extends Component {
  render() {
    const {
      order: { id, amount, ingredient },
      isEditing,
      editAmount,
      onInputChange,
      stopEditing,
      startEditing
    } = this.props;
    return (
      <div key={id} className={orderItem}>
        <div>
          <small>{ingredient.name}</small>
          {isEditing ? (
            <small>
              <input
                id="name"
                placeholder={amount}
                value={editAmount}
                onChange={e => onInputChange(e, id)}
                type="number"
                required={true}
              />
              {ingredient.unit}
            </small>
          ) : (
            <small>
              {amount} {ingredient.unit}
            </small>
          )}
        </div>
        <div>
          <div>
            <Mutation mutation={DELETE_ORDER_MUTATION} variables={{ id }}>
              {(mutation, { loading, error }) => {
                if (error) return <div>Error</div>;

                return (
                  <Button
                    appearance="subtle"
                    isLoading={loading}
                    onClick={mutation}
                  >
                    <DeleteIcon />
                  </Button>
                );
              }}
            </Mutation>
          </div>
          <div>
            {isEditing ? (
              <Fragment>
                <FlagContext.Consumer>
                  {({ addFlag }) => (
                    <Mutation
                      mutation={UPDATE_ORDER_MUTATION}
                      onCompleted={() => this.editOrderSuccess(addFlag)}
                      // update={this.editOrderSuccess}
                    >
                      {mutation => {
                        return (
                          <Button appearance="subtle">
                            <DoneIcon
                              fill="green"
                              onClick={() => {
                                stopEditing(id);

                                mutation({
                                  variables: {
                                    id,
                                    amount: editAmount
                                  }
                                });
                              }}
                            />
                          </Button>
                        );
                      }}
                    </Mutation>
                  )}
                </FlagContext.Consumer>
                <Button appearance="subtle" onClick={() => stopEditing(id)}>
                  <CloseIcon fill="red" />
                </Button>
              </Fragment>
            ) : (
              <Button appearance="subtle" onClick={() => startEditing(id)}>
                <EditIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  editOrderSuccess = addFlag => {
    const { onCompleted } = this.props;

    window.mixpanel.track("Edited an order");

    addFlag({
      type: "success",
      title: "The order was successfully edited",
      description: changesNotice
    });

    if (onCompleted) onCompleted();
  };
}

export default OrdersGridItem;
