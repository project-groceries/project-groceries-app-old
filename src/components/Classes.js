import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { CLASSES_QUERY } from "../queries";
import { fullPage, overviewSection, loaderContainer } from "../styles";
import SamsungTVLoader from "./SamsungTVLoader";
import Enrol from "./Enrol";
import CreateClass from "./CreateClass";
import ClassesGrid from "./ClassesGrid";
import { Switch, Route } from "react-router-dom";
import ClassView from "./ClassView";
import { css } from "emotion";

class Classes extends Component {
  render() {
    return (
      <Query query={CLASSES_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div className={loaderContainer}>
                <SamsungTVLoader />
              </div>
            );

          if (error) return <div>Error</div>;

          const { match } = this.props;
          const { isExact } = match;

          const { classes, enrolledIn, type } = data.user;
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
              <div
                className={css`
                  display: grid;
                  grid-template-columns: ${isExact ? "1fr" : "300px 1fr;"};

                  @media (max-width: 1000px) {
                    grid-template-columns: 1fr;

                    & > div:first-child {
                      ${isExact ? "" : "display: none;"};
                    }
                  }
                `}
              >
                <div
                  className={css`
                    ${overviewSection};
                  `}
                >
                  <h1>Classes</h1>
                  <ClassesGrid />
                </div>
                <Switch>
                  <Route path="/classes/:id" component={ClassView} />
                </Switch>
              </div>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default Classes;
