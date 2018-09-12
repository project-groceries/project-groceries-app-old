import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { OVERVIEW_QUERY } from "../queries";
import SamsungTVLoader from "./SamsungTVLoader";
import Enrol from "./Enrol";
import CreateClass from "./CreateClass";
import ClassesGrid from "./ClassesGrid";
import { fullPage, overviewSection, loaderContainer } from "../styles";

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

          const { classes, enrolledIn, orders, type } = data.user;
          const userClasses = type === "TEACHER" ? classes : enrolledIn;
          const noClasses = !userClasses.length;

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
                {orders.length ? (
                  <p>There are orders</p>
                ) : (
                  <p>There are no orders... yet</p>
                )}
              </div>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default Overview;
