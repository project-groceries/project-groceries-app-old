import React, { Component, Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import { ORDERS_QUERY, UPDATE_ORDER_MUTATION } from "../queries";
import Spinner from "./Spinner";
import Edit from "./svg/Edit";
import { orderItem } from "../styles";
import { css } from "emotion";
import Close from "./svg/Close";
import Done from "./svg/Done";
import UndrawNoData from "./svg/UndrawNoData";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { FlagContext } from "../flag-context";
import { changesNotice } from "../utils";
import Button from "@atlaskit/button";

const bold = css`
  font-weight: bolder;
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
                  // column-count: 3;
                  // column-gap: 1em;

                  margin: 1.5em auto;
                  // max-width: 768px;
                  column-gap: 1.5em;

                  /* Masonry on large screens */
                  @media only screen and (min-width: 1024px) {
                    column-count: 3;
                  }

                  /* Masonry on medium-sized screens */
                  @media only screen and (max-width: 1023px) and (min-width: 768px) {
                    column-count: 2;
                  }

                  /* Masonry on small screens */
                  @media only screen and (max-width: 767px) and (min-width: 540px) {
                    column-count: 1;
                  }

                  & > div {
                    background-color: #eee;
                    display: inline-block;
                    margin: 0 0 1em;
                    width: 100%;

                    background: #fff;
                    padding: 1em;
                    margin: 0 0 1.5em;
                  }
                `}
              >
                {this._groupByOrderSession(orders).map(
                  ({ id, dateCreated, madeBy, orderClass, orders }) => (
                    <div
                      key={id}
                      className={css`
                        border-left: 5px solid rgb(201, 201, 201);
                        padding: 10px;
                        // width: 450px;
                        margin: 10px 20px;
                      `}
                    >
                      <h2>
                        {formatDistance(dateCreated, new Date(), {
                          addSuffix: true
                        })}
                      </h2>
                      <h4>
                        Made by <span className={bold}>{madeBy.name}</span> in{" "}
                        <Link to={`/classes/${orderClass.id}`}>
                          <Button appearance="subtle-link">
                            {orderClass.name}
                          </Button>
                        </Link>
                        {/* <span className={bold}>{orderClass.name}</span> */}
                      </h4>
                      {orders.map(({ id, amount, ingredient }) => (
                        <div key={id} className={orderItem}>
                          <small>{ingredient.name}</small>
                          {editMap.get(id) ? (
                            <Fragment>
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
                              <small> {ingredient.unit}</small>
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
                                        <Done
                                          fill="green"
                                          onClick={() => {
                                            this.setState(prevState => {
                                              prevState.editMap.set(id, false);
                                              prevState.amountMap.delete(id);
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
                                      );
                                    }}
                                  </Mutation>
                                )}
                              </FlagContext.Consumer>
                              <Close
                                fill="red"
                                onClick={() =>
                                  this.setState(prevState => {
                                    prevState.editMap.set(id, false);
                                    prevState.amountMap.delete(id);
                                    return {
                                      editMap: prevState.editMap
                                    };
                                  })
                                }
                              />
                            </Fragment>
                          ) : (
                            <Fragment>
                              <small>
                                {amount} {ingredient.unit}
                              </small>
                              <Edit
                                onClick={() =>
                                  this.setState(prevState => {
                                    prevState.editMap.set(id, true);
                                    return {
                                      editMap: prevState.editMap
                                    };
                                  })
                                }
                              />
                            </Fragment>
                          )}
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
