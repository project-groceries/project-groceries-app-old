import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query } from "react-apollo";
import { OVERVIEW_QUERY } from "../queries";
import SamsungTVLoader from "./SamsungTVLoader";
import Enrol from "./Enrol";
import CreateClass from "./CreateClass";

const fullPage = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const overviewSection = css`
  padding: 10px;
  margin: 10px;
  background-color: goldenrod;
`;

const loaderContainer = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

          const { classes, enrolledIn, orders, school, type } = data.user;
          const { ingredients } = school;
          const userClasses = type === "TEACHER" ? classes : enrolledIn;
          const hasNothing =
            !userClasses.length && !orders.length && !ingredients.length;

          return hasNothing ? (
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
                {userClasses.length ? (
                  <p>There are classes</p>
                ) : (
                  <p>There are no classes... yet</p>
                )}
              </div>
              <div className={overviewSection}>
                <h1>Orders</h1>
                {orders.length ? (
                  <p>There are orders</p>
                ) : (
                  <p>There are no orders... yet</p>
                )}
              </div>
              <div className={overviewSection}>
                <h1>Ingredients</h1>
                {ingredients.length ? (
                  <p>There are ingredients</p>
                ) : (
                  <p>There are no ingredients... yet</p>
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
