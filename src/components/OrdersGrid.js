import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import {
  ORDERS_QUERY,
  UPDATE_ORDER_MUTATION,
  DELETE_ORDERSESSION_MUTATION,
  DELETE_ORDER_MUTATION
} from "../queries";
import Spinner from "./Spinner";
import { orderItem } from "../styles";
import { css } from "emotion";
import UndrawNoData from "./svg/UndrawNoData";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";
import Button from "@atlaskit/button";
import {
  Delete,
  Edit,
  Close,
  Done,
  AccessTime,
  Person,
  Class
} from "styled-icons/material";
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
const AccessTimeIcon = styled(AccessTime)`
  width: 24px;
  color: #6b778c;
  margin: 0px 5px;
`;
const PersonIcon = styled(Person)`
  width: 18px;
  color: #6b778c;
  margin: 0px 5px;
`;
const ClassIcon = styled(Class)`
  width: 18px;
  margin: 0px 5px;
`;

class OrdersGrid extends Component {
  state = {
    editMap: new Map(),
    amountMap: new Map()
  };

  render() {
    return (
      <Query query={ORDERS_QUERY} pollInterval={5000}>
        {({ loading, error, data }) => {
          const hasData = data ? Object.keys(data).length === 1 : undefined;
          if (!hasData && loading) return <Spinner />;

          if (error) return <p>Error</p>;

          const { limit } = this.props;
          const { editMap, amountMap } = this.state;

          const { orders } = data;

          return orders.length ? (
            <Fragment>
              {limit && (
                <p>
                  Showing the latest orders{" "}
                  <Link to="/orders" className="btn default">
                    See all orders
                  </Link>
                </p>
              )}
              <div
                className={css`
                  display: grid;
                  grid-gap: 20px;
                  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                  grid-auto-rows: 80px;
                  grid-auto-flow: dense;
                `}
              >
                {this._groupByOrderSession(orders).map(
                  ({ id, dateCreated, madeBy, orderClass, orders }) => (
                    <div
                      key={id}
                      className={css`
                        // border-left: 5px solid rgb(201, 201, 201);
                        padding: 5px 10px;
                        // width: 350px;
                        // margin: 5px;
                        grid-row: span ${orders.length + 1};
                        box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 2px 0;
                      `}
                    >
                      <div
                        className={css`
                          height: 70px;
                        `}
                      >
                        <div
                          className={css`
                            display: flex;
                            justify-content: space-between;
                          `}
                        >
                          <h2>
                            <AccessTimeIcon />
                            {formatDistance(dateCreated, new Date(), {
                              addSuffix: true
                            })}
                          </h2>
                          <Mutation
                            mutation={DELETE_ORDERSESSION_MUTATION}
                            variables={{ id }}
                          >
                            {(mutation, { loading, error }) => {
                              if (error) return <div>Error</div>;

                              return (
                                <Button
                                  appearance="warning"
                                  isLoading={loading}
                                  onClick={mutation}
                                >
                                  Delete
                                </Button>
                              );
                            }}
                          </Mutation>
                        </div>
                        <h4>
                          <PersonIcon /> {madeBy.name}
                          <Link to={`/classes/${orderClass.id}`}>
                            <Button
                              appearance="subtle-link"
                              className={css`
                                margin-left: 10px;
                              `}
                            >
                              <ClassIcon /> {orderClass.name}
                            </Button>
                          </Link>
                        </h4>
                      </div>
                      {orders.map(({ id, amount, ingredient }) => (
                        <div key={id} className={orderItem}>
                          <div>
                            <small>{ingredient.name}</small>
                            {editMap.get(id) ? (
                              <small>
                                <input
                                  id="name"
                                  placeholder={amount}
                                  value={amountMap.get(id)}
                                  onChange={e => {
                                    const newAmount = e.target.value;

                                    this.setState(prevState => {
                                      prevState.amountMap.set(id, newAmount);

                                      return {
                                        amountMap: prevState.amountMap
                                      };
                                    });
                                  }}
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
                              <Mutation
                                mutation={DELETE_ORDER_MUTATION}
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
                              {editMap.get(id) ? (
                                <Fragment>
                                  <FlagContext.Consumer>
                                    {({ addFlag }) => (
                                      <Mutation
                                        mutation={UPDATE_ORDER_MUTATION}
                                        onCompleted={() =>
                                          this._editOrderSuccess(addFlag)
                                        }
                                        // update={this._editOrderSuccess}
                                      >
                                        {mutation => {
                                          return (
                                            <Button appearance="subtle">
                                              <DoneIcon
                                                fill="green"
                                                onClick={() => {
                                                  this.setState(prevState => {
                                                    prevState.editMap.set(
                                                      id,
                                                      false
                                                    );
                                                    prevState.amountMap.delete(
                                                      id
                                                    );
                                                    return {
                                                      editMap: prevState.editMap
                                                    };
                                                  });

                                                  mutation({
                                                    variables: {
                                                      id,
                                                      amount: amountMap.get(id)
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
                                  <Button
                                    appearance="subtle"
                                    onClick={() =>
                                      this.setState(prevState => {
                                        prevState.editMap.set(id, false);
                                        prevState.amountMap.delete(id);
                                        return {
                                          editMap: prevState.editMap
                                        };
                                      })
                                    }
                                  >
                                    <CloseIcon fill="red" />
                                  </Button>
                                </Fragment>
                              ) : (
                                <Button
                                  appearance="subtle"
                                  onClick={() =>
                                    this.setState(prevState => {
                                      prevState.editMap.set(id, true);
                                      return {
                                        editMap: prevState.editMap
                                      };
                                    })
                                  }
                                >
                                  <EditIcon />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </Fragment>
          ) : (
            <div
              className="flex-center column"
              style={limit ? {} : { height: "calc(100vh - 70px)" }}
            >
              <UndrawNoData height="200px" />
              <p>There are no orders yet</p>
            </div>
          );
        }}
      </Query>
    );
  }

  _groupByOrderSession = orders => {
    const { limit } = this.props;
    const orderSessions = [];

    orders.forEach(order => {
      const {
        id,
        amount,
        ingredient,
        orderSession: { id: orderSessionId },
        madeBy,
        class: orderClass
      } = order;

      if (
        orderSessions.some(orderSession => orderSession.id === orderSessionId)
      ) {
        const orderSession = orderSessions.find(
          orderSession => orderSession.id === orderSessionId
        );
        orderSession.orders.push({ id, amount, ingredient });
      } else {
        orderSessions.push({
          ...order.orderSession,
          dateCreated: new Date(order.orderSession.createdAt),
          madeBy,
          orderClass,
          orders: [{ id, amount, ingredient }]
        });
      }
    });

    return orderSessions.reverse().slice(0, limit);
  };

  _editOrderSuccess = addFlag => {
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

export default OrdersGrid;
