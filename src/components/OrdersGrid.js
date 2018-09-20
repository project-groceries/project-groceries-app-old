import React, { Component } from "react";
import { Query } from "react-apollo";
import { ORDERS_QUERY } from "../queries";
import Spinner from "./Spinner";
import { orderItem } from "../styles";
import { css } from "emotion";

class OrdersGrid extends Component {
  render() {
    return (
      <Query query={ORDERS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;

          if (error) return <p>Error</p>;

          const { orders } = data.user;

          return (
            <div
              className={css`
                // column-count: 4;
                // column-gap: 1em;

                margin: 1.5em auto;
                // max-width: 768px;
                column-gap: 1.5em;

                /* Masonry on large screens */
                @media only screen and (min-width: 1024px) {
                  column-count: 4;
                }

                /* Masonry on medium-sized screens */
                @media only screen and (max-width: 1023px) and (min-width: 768px) {
                  column-count: 3;
                }

                /* Masonry on small screens */
                @media only screen and (max-width: 767px) and (min-width: 540px) {
                  column-count: 2;
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
                ({ id, dateCreated, orders }) => (
                  <div
                    key={id}
                    className={css`
                      border-left: 5px solid rgb(201, 201, 201);
                      padding: 10px;
                      width: 350px;
                      margin: 10px 20px;
                    `}
                  >
                    <h2>{dateCreated.toDateString()}</h2>
                    {orders.map(({ id, amount, ingredient }) => (
                      <div key={id} className={orderItem}>
                        <h3>{ingredient.name}</h3>
                        <small>
                          {amount} {ingredient.unit}
                        </small>
                      </div>
                    ))}
                  </div>
                )
              )}
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
        orderSession: { id: orderSessionId }
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
          orders: [{ id, amount, ingredient }]
        });
      }
    });

    return orderSessions.reverse().slice(0, limit);
  };
}

export default OrdersGrid;
