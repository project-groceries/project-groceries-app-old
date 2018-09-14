/* global mixpanel */

import React, { Component, Fragment } from "react";
import logo from "../logo.svg";
import "@reach/dialog/styles.css";
// import "../styles/App.css"
// import LinkList from "./LinkList";
// import CreateLink from "./CreateLink";
// import Header from "./Header";
import { Switch, Route, Redirect, Link, NavLink } from "react-router-dom";
import LogRocket from "logrocket";
import Login from "./Login";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Query } from "react-apollo";
import NoSchool from "./NoSchool";
import Logo from "./svg/Logo";
import SamsungTVLoader from "./SamsungTVLoader";
import { USER_QUERY } from "../queries";
import DeclareAccountType from "./DeclareAccountType";
import { css } from "emotion";
import Group from "./svg/Group";
import List from "./svg/List";
import Cart from "./svg/Cart";
import Overview from "./Overview";
import Classes from "./Classes";
import Orders from "./Orders";
import Ingredients from "./Ingredients";
import { Offline } from "react-detect-offline";
import Menu from "./svg/Menu";
import { circleIcon } from "../styles";

const bodyWrapper = css`
  height: 100vh;
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-auto-rows: 1fr;

  & > * {
    overflow: auto;
  }
`;

const menuSection = css`
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;

  .menuSectionTitle {
    background-color: rgba(0, 0, 0, 0.1);
    // border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 2px 0;
  }

  h3 {
    margin-left: 10px;
  }

  svg {
    height: 30px;
  }

  & > a:not(:first-child) {
    margin: 5px 0;
  }
`;

const offlineBanner = css`
  position: absolute;
  background-color: #ff9e36;
  padding: 10px;
  width: 250px;
  bottom: 10px;
  right: calc(50% - 125px);
  border-radius: 10px;
  text-align: center;
`;

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = this.props;
    this.state = {
      hasToken: cookies.get("token") || undefined,
      menuIsOpen: false
    };
  }

  componentWillUpdate() {
    const { cookies } = this.props;
    const { hasToken } = this.state;
    const tempToken = cookies.get("token");
    if (tempToken !== hasToken) {
      this.setState({ hasToken: cookies.get("token") || undefined });
    }
  }

  componentDidUpdate() {
    window.Intercom("update");
  }

  render() {
    const { cookies } = this.props;
    const { hasToken, menuIsOpen } = this.state;

    return (
      <Fragment>
        <Offline>
          <div className={offlineBanner}>
            Offline: Changes made now may not be saved
          </div>
        </Offline>
        {hasToken ? (
          <div className={bodyWrapper}>
            <Query query={USER_QUERY}>
              {({ loading, error, data }) => {
                if (loading)
                  return (
                    <div
                      className="flex-center column"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh"
                      }}
                    >
                      <img
                        src={logo}
                        alt="Project Groceries"
                        height="80px"
                        className={css`
                          transform: translateY(30px);
                        `}
                      />
                      <SamsungTVLoader />
                    </div>
                  );
                if (error) return <div>Error</div>;

                const {
                  email,
                  name,
                  type,
                  hasDeclaredAccountType,
                  createdAt,
                  school,
                  classes,
                  enrolledIn
                } = data.user;
                const hasCompletedDetails = Boolean(
                  school && hasDeclaredAccountType
                );
                const userClasses = type === "TEACHER" ? classes : enrolledIn;

                LogRocket.identify(email, {
                  name,
                  email,
                  type
                });

                window.Intercom("boot", {
                  app_id: "e1sx7dly",
                  name, // Full name
                  email, // Email address
                  "Account Type": type,
                  "Company Name": school ? school.name : ""
                  // created_at: "yolo" // Signup date
                });

                // Mixpanel user identification
                mixpanel.identify(email);
                mixpanel.people.set({
                  // only special properties need the $
                  $email: email,
                  $name: name,
                  $created: createdAt,
                  type: type
                });

                return (
                  <Fragment>
                    <section
                      style={{
                        backgroundColor: "rgb(236, 236, 236)",
                        transition: "all 0.3s ease",
                        filter: hasCompletedDetails ? "none" : "blur(8px)",
                        pointerEvents: hasCompletedDetails ? "auto" : "none",
                        position: "fixed",
                        height: "100vh",
                        width: "250px",
                        zIndex: 2,
                        transform: menuIsOpen ? "" : "translateX(-100%)"
                      }}
                    >
                      <div
                        className="bar"
                        style={{ backgroundColor: "#83c674" }}
                      >
                        <Link to="/">
                          <Logo fill="white" />
                        </Link>
                        <h1>{name}</h1>
                      </div>

                      <div className={menuSection}>
                        <Link to="/classes">
                          <div className="menuSectionTitle">
                            <Group />
                            <h3>Classes</h3>
                          </div>
                        </Link>
                        {userClasses.length ? (
                          userClasses.map(c => (
                            <NavLink
                              key={c.id}
                              to={`/classes/${c.id}`}
                              activeStyle={{
                                boxShadow: "0px 0px 1px rgba(0,0,0,0.5)"
                              }}
                            >
                              {c.name}
                            </NavLink>
                          ))
                        ) : (
                          <small>There are no classes... yet</small>
                        )}
                      </div>

                      <div className={menuSection}>
                        <Link to="/orders">
                          <div className="menuSectionTitle">
                            <List />
                            <h3>Orders</h3>
                          </div>
                        </Link>
                      </div>

                      <div className={menuSection}>
                        <Link to="/ingredients">
                          <div className="menuSectionTitle">
                            <Cart />
                            <h3>Ingredients</h3>
                          </div>
                        </Link>
                      </div>

                      <input
                        type="button"
                        value="Sign Out"
                        onClick={() => cookies.remove("token")}
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px"
                        }}
                      />
                    </section>
                    <div
                      className={css`
                        background-color: rgb(245, 245, 245);
                      `}
                    >
                      <div
                        className={css`
                          ${circleIcon};
                          left: 10px;
                          ${menuIsOpen ? "transform: translateX(250px);" : ""};
                        `}
                        onClick={() =>
                          this.setState(prevState => ({
                            menuIsOpen: !prevState.menuIsOpen
                          }))
                        }
                      >
                        <Menu />
                      </div>
                    </div>
                    <main>
                      {school ? (
                        hasDeclaredAccountType ? (
                          <Switch>
                            <Route exact path="/" component={Overview} />
                            <Route path="/classes" component={Classes} />
                            <Route exact path="/orders" component={Orders} />
                            <Route
                              path="/ingredients"
                              component={Ingredients}
                            />
                            <Route render={() => <Redirect to="/" />} />
                          </Switch>
                        ) : (
                          <DeclareAccountType />
                        )
                      ) : (
                        <NoSchool />
                      )}
                    </main>
                  </Fragment>
                );
              }}
            </Query>
          </div>
        ) : (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        )}
      </Fragment>
    );
  }
}

export default withCookies(App);
