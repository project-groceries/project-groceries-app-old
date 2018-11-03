import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { OVERVIEW_QUERY } from "../queries";
import SamsungTVLoader from "./SamsungTVLoader";
import Enrol from "./Enrol";
import CreateClass from "./CreateClass";
import ClassesGrid from "./ClassesGrid";
import { fullPage, overviewSection, loaderContainer } from "../styles";
import OrdersGrid from "./OrdersGrid";
import { Link } from "react-router-dom";

class Overview extends Component {
  render() {
    return (
      <Query query={OVERVIEW_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div className={loaderContainer}>
                <SamsungTVLoader />
              </div>
            );

          if (error) return <div>Error</div>;

          const { user, classes } = data;
          const { orders, type } = user;
          const noClasses = !classes.length;

          return noClasses ? (
            type === "STUDENT" ? (
              <div className={fullPage}>
                <h2>You aren't enrolled in any classes yet!</h2>
                <Enrol />
              </div>
            ) : (
              <div className={fullPage}>
                <CreateClass />
              </div>
            )
          ) : (
            <Fragment>
              <div className={overviewSection}>
                <h1>Classes</h1>
                <ClassesGrid />
              </div>
              <div className={overviewSection}>
                <h1>Orders</h1>
                <OrdersGrid limit={5} />
              </div>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default Overview;
