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
import SamsungTVLoader from "./SamsungTVLoader";
import { USER_QUERY } from "../queries";
import DeclareAccountType from "./DeclareAccountType";
import { css } from "emotion";
import People from "./svg/People";
import List from "./svg/List";
import ShoppingBasket from "./svg/ShoppingBasket";
import Overview from "./Overview";
import Classes from "./Classes";
import ClassView from "./ClassView";
import Orders from "./Orders";
import Ingredients from "./Ingredients";
import { Offline } from "react-detect-offline";
import Menu from "./svg/Menu";
import { circleIcon, noPrint } from "../styles";
import Signup from "./Signup";
import Power from "./svg/Power";

import Tooltip from "@atlaskit/tooltip";
import Avatar from "@atlaskit/avatar";
// import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import InlineDialog from "@atlaskit/inline-dialog";

import styled from "styled-components";
import { AddShoppingCart, Close } from "styled-icons/material";
import OrderCarousel from "./OrderCarousel";

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
  z-index: 2;
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
      menuIsOpen: false,
      isOrderModalOpen: false
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
    const { hasToken, menuIsOpen, isOrderModalOpen } = this.state;

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

                const {
                  email,
                  name,
                  type,
                  hasDeclaredAccountType,
                  createdAt,
                  school,
                  classes,
                  enrolledIn,
                  avatar
                } = data.user;
                const hasCompletedDetails = Boolean(
                  school && hasDeclaredAccountType
                );
                const isTeacher = type === "TEACHER";
                const userClasses = isTeacher ? classes : enrolledIn;

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
                  "Has Classes": !!userClasses.length,
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
                    <section
                      className={css`
                        ${noPrint};

                        background-color: rgb(236, 236, 236);
                        transition: all 0.3s ease;

                        filter: ${hasCompletedDetails ? "none" : "blur(8px)"};
                        pointer-events: ${hasCompletedDetails
                          ? "auto"
                          : "none"};

                        position: fixed;
                        height: 100vh;
                        width: 250px;
                        z-index: 2;
                        transform: ${menuIsOpen ? "none" : "translateX(-100%)"};
                      `}
                    >
                      <div
                        className={css`
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          height: 60px;
                          padding: 10px;
                        `}
                      >
                        <Avatar size="large" src={avatar} />
                        <h1>{school ? school.name : "No School"}</h1>
                      </div>

                      <div className={menuSection}>
                        <Link to="/classes" onClick={this._closeMenu}>
                          <div className="menuSectionTitle">
                            <People />
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
                              onClick={this._closeMenu}
                            >
                              {c.name}
                            </NavLink>
                          ))
                        ) : (
                          <small>There are no classes... yet</small>
                        )}
                      </div>

                      <div className={menuSection}>
                        <Link to="/orders" onClick={this._closeMenu}>
                          <div className="menuSectionTitle">
                            <List />
                            <h3>Orders</h3>
                          </div>
                        </Link>
                      </div>

                      <div className={menuSection}>
                        <Link to="/ingredients" onClick={this._closeMenu}>
                          <div className="menuSectionTitle">
                            <ShoppingBasket />
                            <h3>Ingredients</h3>
                          </div>
                        </Link>
                      </div>

                      <input
                        type="button"
                        value="Sign Out"
                        onClick={() => {
                          this.setState({ menuIsOpen: false });

                          client.resetStore();
                          cookies.remove("token", {
                            path: "/"
                          });
                        }}
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px"
                        }}
                      />
                    </section>
                    <div
                      className={css`
                        ${noPrint};
                        background-color: rgb(245, 245, 245);
                      `}
                    >
                      <div
                        className={css`
                          ${circleIcon};
                          top: 10px;
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
                      <Tooltip position="right" content="Classes" delay={100}>
                        <Link
                          to="/classes"
                          onClick={this._closeMenu}
                          className={css`
                            ${circleIcon} left: 10px;
                            top: 80px;
                          `}
                        >
                          <People />
                        </Link>
                      </Tooltip>
                      <Tooltip position="right" content="Orders" delay={100}>
                        <Link
                          to="/orders"
                          onClick={this._closeMenu}
                          className={css`
                            ${circleIcon} left: 10px;
                            top: 130px;
                          `}
                        >
                          <List />
                        </Link>
                      </Tooltip>
                      <Tooltip
                        position="right"
                        content="Ingredients"
                        delay={100}
                      >
                        <Link
                          to="/ingredients"
                          onClick={this._closeMenu}
                          className={css`
                            ${circleIcon} left: 10px;
                            top: 180px;
                          `}
                        >
                          <ShoppingBasket />
                        </Link>
                      </Tooltip>
                      <Tooltip position="right" content="Sign Out" delay={100}>
                        <div
                          to="/ingredients"
                          onClick={() => {
                            this.setState({ menuIsOpen: false });

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
                    <main>
                      {school ? (
                        hasDeclaredAccountType ? (
                          <Fragment>
                            <Switch>
                              <Route exact path="/" component={Overview} />
                              <Route
                                exact
                                path="/classes"
                                component={Classes}
                              />
                              <Route
                                exact
                                path="/classes/:id"
                                component={ClassView}
                              />
                              <Route exact path="/orders" component={Orders} />
                              <Route
                                path="/ingredients"
                                component={Ingredients}
                              />
                              <Route render={() => <Redirect to="/" />} />
                            </Switch>
                            {userClasses.length && (
                              <Fragment>
                                <InlineDialog
                                  onClose={() => {
                                    this.setState({ dialogOpen: false });
                                  }}
                                  content={
                                    <div
                                      className={css`
                                        height: 400px;
                                        overflow: auto;
                                        width: 400px;
                                      `}
                                    >
                                      <OrderCarousel />
                                    </div>
                                  }
                                  placement="left-end"
                                  isOpen={isOrderModalOpen}
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
                                    onClick={() =>
                                      this.setState(pp => ({
                                        isOrderModalOpen: !pp.isOrderModalOpen
                                      }))
                                    }
                                  >
                                    {isOrderModalOpen ? (
                                      <WhiteClose />
                                    ) : (
                                      <WhiteAddShoppingCart />
                                    )}
                                  </button>
                                </InlineDialog>
                                {/* <ModalTransition>
                                  {isOrderModalOpen && (
                                    <Modal
                                      actions={[
                                        {
                                          text: "Close",
                                          onClick: () =>
                                            this.setState({
                                              isOrderModalOpen: false
                                            })
                                        },
                                        {
                                          text: "Secondary Action",
                                          onClick: () =>
                                            console.log("you played yourself")
                                        }
                                      ]}
                                      onClose={() =>
                                        this.setState({
                                          isOrderModalOpen: false
                                        })
                                      }
                                      heading="Modal Title"
                                    >
                                      <p>
                                        Sit nulla est ex deserunt exercitation
                                        anim occaecat. Nostrud ullamco deserunt
                                        aute id consequat veniam incididunt duis
                                        in sint irure nisi. Mollit officia
                                        cillum Lorem ullamco minim nostrud elit
                                        officia tempor esse quis.
                                      </p>
                                      <p>
                                        Sunt ad dolore quis aute consequat.
                                        Magna exercitation reprehenderit magna
                                        aute tempor cupidatat consequat elit
                                        dolor adipisicing. Mollit dolor eiusmod
                                        sunt ex incididunt cillum quis. Velit
                                        duis sit officia eiusmod Lorem aliqua
                                        enim laboris do dolor eiusmod. Et mollit
                                        incididunt nisi consectetur esse laborum
                                        eiusmod pariatur proident Lorem eiusmod
                                        et. Culpa deserunt nostrud ad veniam.
                                      </p>
                                    </Modal>
                                  )}
                                </ModalTransition> */}
                              </Fragment>
                            )}
                          </Fragment>
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
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        )}
      </Fragment>
    );
  }

  _closeMenu = () => {
    this.setState({ menuIsOpen: false });
  };
}

export default withCookies(App);
