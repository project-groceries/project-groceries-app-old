import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { ORDERS_QUERY } from "../queries";
import Spinner from "./Spinner";
import { css } from "emotion";
import UndrawNoData from "./svg/UndrawNoData";
import { Link } from "react-router-dom";
import OrdersGridSession from "./OrdersGridSession";

class OrdersGrid extends Component {
  render() {
    return (
      <Query query={ORDERS_QUERY} pollInterval={5000}>
        {({ loading, error, data }) => {
          // const hasData = data ? Object.keys(data).length === 1 : undefined;
          if (loading) return <Spinner />;

          if (error) return <p>Error</p>;

          const { limit } = this.props;

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
                  grid-auto-rows: 100px;
                  grid-auto-flow: dense;

                  margin-bottom: 100px; // space for select menu
                `}
              >
                {this.groupByOrderSession(orders).map(orderSession => (
                  <OrdersGridSession
                    key={orderSession.id}
                    orderSession={orderSession}
                  />
                ))}
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

  groupByOrderSession = orders => {
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
}

export default OrdersGrid;
