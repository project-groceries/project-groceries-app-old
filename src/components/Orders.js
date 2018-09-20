import React, { Component } from "react";
import { Query } from "react-apollo";
import { ORDERS_QUERY } from "../queries";
import Spinner from "./Spinner";
import { overviewSection } from "../styles";
import OrdersGrid from "./OrdersGrid";

class Orders extends Component {
  render() {
    return (
      <Query query={ORDERS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;

          if (error) return <p>Error</p>;

          const { orders } = data.user;

          return (
            <div className={overviewSection}>
              <h1>Orders</h1>
              <p>You have made {orders.length} orders</p>
              <OrdersGrid />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Orders;
