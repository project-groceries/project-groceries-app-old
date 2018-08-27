import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { Query } from "react-apollo";
import { OVERVIEW_QUERY } from "../queries";
import SamsungTVLoader from "./SamsungTVLoader";

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

          const { classes, orders, school } = data.user;
          const { ingredients } = school;

          return (
            <Fragment>
              <div className={overviewSection}>
                <h1>Classes</h1>
                {classes.length ? (
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
