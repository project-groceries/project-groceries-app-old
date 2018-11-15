/* global mixpanel */

import React, { Component, Fragment } from "react";
import logo from "../logo.svg";
import "@reach/dialog/styles.css";
// import "../styles/App.css"
// import LinkList from "./LinkList";
// import CreateLink from "./CreateLink";
// import Header from "./Header";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import LogRocket from "logrocket";
import Login from "./Login";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Query } from "react-apollo";
import SamsungTVLoader from "./SamsungTVLoader";
import { USER_QUERY } from "../queries";
import DeclareAccountType from "./DeclareAccountType";
import { css } from "emotion";
import Overview from "./Overview";
import ClassView from "./ClassView";
import Orders from "./Orders";
import { Offline } from "react-detect-offline";
import { circleIcon, noPrint } from "../styles";
import Signup from "./Signup";
import Power from "./svg/Power";

import Tooltip from "@atlaskit/tooltip";
import InlineDialog from "@atlaskit/inline-dialog";
import Flag, { FlagGroup } from "@atlaskit/flag";
import Button from "@atlaskit/button";

import styled from "styled-components";
import { AddShoppingCart, Close, Home } from "styled-icons/material";
import OrderCarousel from "./OrderCarousel";
import JoinSchool from "./JoinSchool";

import { FlagContext } from "../flag-context";

const WhiteAddShoppingCart = styled(AddShoppingCart)`
  color: white;
  width: 28px;
  height: 32px;
`;

const WhiteClose = styled(Close)`
  color: white;
  width: 28px;
  height: 32px;
`;

const BlackHome = styled(Home)`
  color: black;
  width: 24px;
`;

const bodyWrapper = css`
  @media screen {
    height: 100vh;
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-auto-rows: 1fr;

    & > * {
      overflow: auto;
    }
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
  z-index: 2;
`;

const getRandomDescription = () => {
  const descriptions = [
    "Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.",
    "Fruitcake topping wafer pie candy dragée sesame snaps cake. Cake cake cheesecake. Pie tiramisu carrot cake tart tart dessert cookie. Lemon drops cookie tootsie roll marzipan liquorice cotton candy brownie halvah."
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getFlagData = (index, timeOffset = 0) => {
  return {
    created: Date.now() - timeOffset * 1000,
    description: getRandomDescription(),
    // icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`
  };
};

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  state = {
    hasToken: this.props.cookies.get("token") || undefined,
    isOrderDialogOpen: false,
    flags: []
  };
  flagCount = 0;

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
    const { hasToken, isOrderDialogOpen } = this.state;

    const actions = [
      {
        content: "Nice one!",
        onClick: () => {}
      },
      { content: "Not right now thanks", onClick: this.dismissFlag }
    ];

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
              {({ loading, error, data, client }) => {
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

                const { user, classes } = data;
                const {
                  email,
                  name,
                  type,
                  hasDeclaredAccountType,
                  createdAt,
                  school
                } = user;

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
                  "Has Classes": !!classes.length,
                  company: {
                    id: school ? school.id : "",
                    name: school ? school.name : ""
                  }
                });

                // Mixpanel user identification
                mixpanel.people.set({
                  // only special properties need the $
                  $email: email,
                  $name: name,
                  $created: createdAt,
                  type: type
                });

                return (
                  <Fragment>
                    <div
                      className={css`
                        ${noPrint};
                        background-color: rgb(245, 245, 245);
                      `}
                    >
                      <Link
                        to="/"
                        className={css`
                          ${circleIcon};
                          top: 10px;
                          left: 10px;
                        `}
                      >
                        <BlackHome />
                      </Link>
                      <Tooltip position="right" content="Sign Out" delay={100}>
                        <div
                          onClick={() => {
                            client.resetStore();
                            cookies.remove("token", {
                              path: "/"
                            });
                          }}
                          className={css`
                            ${circleIcon} bottom: 10px;
                            left: 10px;
                          `}
                        >
                          <Power />
                        </div>
                      </Tooltip>
                    </div>
                    <div>
                      {school ? (
                        hasDeclaredAccountType ? (
                          <FlagContext.Provider
                            value={{
                              addFlag: this.addFlag,
                              dismissFlag: this.dismissFlag
                            }}
                          >
                            <Fragment>
                              <FlagGroup onDismissed={this.dismissFlag}>
                                {this.state.flags.map(flag => (
                                  <Flag actions={actions} {...flag} />
                                ))}
                              </FlagGroup>
                              <Button onClick={this.addFlag}>Add Flag</Button>
                              <Switch>
                                <Route exact path="/" component={Overview} />
                                <Route
                                  exact
                                  path="/classes/:id"
                                  component={ClassView}
                                />
                                <Route
                                  exact
                                  path="/orders"
                                  component={Orders}
                                />
                                <Route render={() => <Redirect to="/" />} />
                              </Switch>
                              {classes.length && (
                                <Fragment>
                                  <InlineDialog
                                    // onClose={() => {
                                    //   this.setState({ isOrderDialogOpen: false });
                                    // }}
                                    content={
                                      <div
                                        className={css`
                                          height: 400px;
                                          overflow: auto;
                                          width: 400px;
                                        `}
                                      >
                                        <OrderCarousel
                                          onCompleted={() =>
                                            this.setState({
                                              isOrderDialogOpen: false
                                            })
                                          }
                                        />
                                      </div>
                                    }
                                    placement="left-end"
                                    isOpen={isOrderDialogOpen}
                                  >
                                    <button
                                      className={css`
                                        margin: 0;
                                        position: fixed;
                                        bottom: 20px;
                                        right: calc(20px + 60px + 20px + 20px);
                                        width: 60px;
                                        height: 60px;
                                        border-radius: 30px;
                                        background: #83c674;

                                        box-shadow: 0 1px 6px 0
                                            rgba(0, 0, 0, 0.06),
                                          0 2px 32px 0 rgba(0, 0, 0, 0.16);

                                        display: flex;
                                        justify-content: center;
                                        align-items: center;

                                        transition: all 0.3s ease;

                                        &:hover {
                                          transform: scale(1.1);
                                        }
                                      `}
                                      onClick={e => {
                                        e.preventDefault();
                                        this.setState(pp => ({
                                          isOrderDialogOpen: !pp.isOrderDialogOpen
                                        }));
                                      }}
                                    >
                                      {isOrderDialogOpen ? (
                                        <WhiteClose />
                                      ) : (
                                        <WhiteAddShoppingCart />
                                      )}
                                    </button>
                                  </InlineDialog>
                                </Fragment>
                              )}
                            </Fragment>
                          </FlagContext.Provider>
                        ) : (
                          <DeclareAccountType />
                        )
                      ) : (
                        <JoinSchool />
                      )}
                    </div>
                  </Fragment>
                );
              }}
            </Query>
          </div>
        ) : (
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        )}
      </Fragment>
    );
  }

  addFlag = () => {
    const flags = this.state.flags.slice();
    flags.unshift(getFlagData(this.flagCount++));
    this.setState({ flags });
  };

  dismissFlag = () => {
    this.setState(state => ({ flags: state.flags.slice(1) }));
    this.flagCount--;
  };
}

export default withCookies(App);
