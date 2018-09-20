import React, { Component } from "react";
import { overviewSection } from "../styles";
import OrdersGrid from "./OrdersGrid";

class Orders extends Component {
  render() {
    return (
      <div className={overviewSection}>
        <h1>Orders</h1>
        <OrdersGrid />
      </div>
    );
  }
}

export default Orders;
