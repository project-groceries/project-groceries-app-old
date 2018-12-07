import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_ORDER_MUTATION, DELETE_ORDER_MUTATION } from "../queries";
import { orderItem } from "../styles";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";
import Button from "@atlaskit/button";
import { Delete, Edit, Close, Done } from "styled-icons/material";
import styled from "styled-components";
import { RadioSelect } from "@atlaskit/select";

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

const AmountContainer = styled.div`
  & > div {
    width: 150px;
    display: inline-block;

    margin-left: 8px;
  }

  & > div > div > div:first-child {
    height: 20px;
  }

  & > div:nth-child(2) > input {
    margin: 0;
    padding: 0;
    height: auto;
  }
`;

class OrdersGridItem extends Component {
  state = {
    scale: this.props.order.ingredient.measurement
      ? this.props.order.ingredient.measurement.scales
          .map(s => ({ label: s.name, value: s.amount }))
          .find(s => s.value === 1)
      : null
  };

  render() {
    const {
      order: {
        id,
        amount,
        ingredient: { name, unit, measurement }
      },
      isEditing,
      editAmount,
      onInputChange,
      stopEditing,
      startEditing
    } = this.props;

    const { scale } = this.state;

    return (
      <div key={id} className={orderItem}>
        <div>
          <small>{name}</small>
          {isEditing ? (
            <AmountContainer>
              <input
                id="name"
                placeholder={scale ? amount / scale.value : amount}
                value={editAmount}
                onChange={e => onInputChange(e, id)}
                type="number"
                required={true}
              />
              {scale ? (
                <RadioSelect
                  className="radio-select"
                  classNamePrefix="react-select"
                  maxMenuHeight={100}
                  defaultValue={scale}
                  options={this.getScaleOptions(measurement)}
                  onChange={this.onScaleChange}
                />
              ) : (
                unit
              )}
            </AmountContainer>
          ) : scale ? (
            <AmountContainer>
              <small>{amount / scale.value}</small>
              <RadioSelect
                className="radio-select"
                classNamePrefix="react-select"
                maxMenuHeight={100}
                defaultValue={scale}
                options={this.getScaleOptions(measurement)}
                onChange={this.onScaleChange}
              />
            </AmountContainer>
          ) : (
            <small>
              {amount} {unit}
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
                                    amount: scale
                                      ? editAmount * scale.value
                                      : editAmount
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

  getScaleOptions = measurement =>
    measurement.scales.map(s => ({ label: s.name, value: s.amount }));

  onScaleChange = data => {
    if (data.value) {
      this.setState({
        scale: data
      });
    }
  };

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
