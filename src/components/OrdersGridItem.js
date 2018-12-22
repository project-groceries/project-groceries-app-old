import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import {
  UPDATE_ORDER_MUTATION,
  DELETE_ORDER_MUTATION,
  CLASS_VIEW_GRID_QUERY,
  ORDERS_QUERY
} from "../queries";
import { orderItem } from "../styles";
import { FlagContext } from "../flag-context";
import {
  changesNotice,
  scaleToOption,
  massToVolume,
  getSpecificScale,
  getScaleOptions,
  volumeToMass
} from "../utils";
import Button from "@atlaskit/button";
import { Delete, Edit, Close, Done } from "styled-icons/material";
import styled from "styled-components";
import Select from "react-select";

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

  // & > div > div > div:first-child {
  //   height: 20px;
  // }

  // & > div:nth-child(2) > input {
  //   margin: 0;
  //   padding: 0;
  //   height: auto;
  // }
`;

class OrdersGridItem extends Component {
  state = {
    scale: this.props.order.scale
      ? this.props.order.scale
      : this.props.order.ingredient.measurement
      ? getSpecificScale(this.props.order.ingredient.measurement, 1000)
      : null
  };

  render() {
    const {
      order: {
        id,
        amount,
        ingredient: { name, unit, measurement, density }
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
                placeholder={
                  !scale
                    ? amount
                    : scale.isMass
                    ? massToVolume(amount, scale.amount, density)
                    : amount / scale.amount
                }
                value={editAmount}
                onChange={e => onInputChange(e, id)}
                type="number"
                required={true}
              />
              {scale ? (
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={scaleToOption(scale)}
                  isSearchable={false}
                  options={getScaleOptions(measurement)}
                  maxMenuHeight={100}
                  onChange={data => this.onScaleChange(data, measurement)}
                />
              ) : (
                unit
              )}
            </AmountContainer>
          ) : scale ? (
            <AmountContainer>
              <small>
                {scale.isMass
                  ? massToVolume(amount, scale.amount, density)
                  : amount / scale.amount}
              </small>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={scaleToOption(scale)}
                isSearchable={false}
                options={getScaleOptions(measurement)}
                maxMenuHeight={100}
                onChange={data => this.onScaleChange(data, measurement)}
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
            <Mutation
              mutation={DELETE_ORDER_MUTATION}
              refetchQueries={[
                { query: CLASS_VIEW_GRID_QUERY },
                { query: ORDERS_QUERY }
              ]}
              variables={{ id }}
            >
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
                {editAmount && (
                  <Mutation
                    mutation={UPDATE_ORDER_MUTATION}
                    onCompleted={this.editOrderSuccess}
                  >
                    {mutation => {
                      return (
                        <Button
                          appearance="subtle"
                          onClick={() => {
                            stopEditing(id);

                            mutation({
                              variables: {
                                id,
                                amount: scale
                                  ? scale.isMass
                                    ? volumeToMass(
                                        editAmount,
                                        scale.amount,
                                        density
                                      )
                                    : editAmount * scale.amount
                                  : editAmount
                              }
                            });
                          }}
                        >
                          <DoneIcon fill="green" />
                        </Button>
                      );
                    }}
                  </Mutation>
                )}
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

  onScaleChange = (data, measurement) => {
    if (data.value) {
      this.setState({ scale: getSpecificScale(measurement, data.value) });
    }
  };

  editOrderSuccess = () => {
    const { onCompleted } = this.props;

    window.mixpanel.track("Edited an order");

    if (onCompleted) onCompleted();
  };
}

export default OrdersGridItem;
