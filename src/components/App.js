import React, { Component, Fragment } from "react";
import logo from "../logo.svg";
// import "../styles/App.css"
// import LinkList from "./LinkList";
// import CreateLink from "./CreateLink";
// import Header from "./Header";
import { Switch, Route, Redirect, Link, NavLink } from "react-router-dom";
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

const menuSection = css`
  padding: 10px;
  text-align: center;

  .menuSectionTitle {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin-left: 10px;
  }

  svg {
    height: 30px;
  }
`;

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = this.props;
    this.state = {
      hasToken: cookies.get("token") || undefined
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

  render() {
    const { cookies } = this.props;

    return this.state.hasToken ? (
      <div
        style={{
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          // gridTemplateRows: "auto",
          gridAutoRows: "1fr"
        }}
      >
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

            const { name, hasDeclaredAccountType, school, classes } = data.user;
            const hasCompletedDetails = Boolean(
              school && hasDeclaredAccountType
            );

            return (
              <Fragment>
                <section
                  style={{
                    backgroundColor: "rgba(128, 128, 128, 0.1)",
                    transition: "all 0.6s ease",
                    filter: hasCompletedDetails ? "none" : "blur(8px)",
                    pointerEvents: hasCompletedDetails ? "auto" : "none"
                  }}
                >
                  <div
                    className="bar"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  >
                    <Link to="/">
                      <Logo />
                    </Link>
                    <h1>{name}</h1>
                  </div>

                  <div className={menuSection}>
                    <Link to="/classes">
                      <div className="menuSectionTitle">
                        <Group />
                        <h1>Classes</h1>
                      </div>
                    </Link>
                    {classes.length ? (
                      classes.map(c => (
                        <NavLink
                          key={c.id}
                          to={`/classes/${c.id}`}
                          activeStyle={{ backgroundColor: "blue" }}
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
                        <h1>Orders</h1>
                      </div>
                    </Link>
                  </div>

                  <div className={menuSection}>
                    <Link to="/ingredients">
                      <div className="menuSectionTitle">
                        <Cart />
                        <h1>Ingredients</h1>
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
                <main>
                  {school ? (
                    hasDeclaredAccountType ? (
                      <Switch>
                        <Route exact path="/" component={Overview} />
                        <Route exact path="/classes" component={Classes} />
                        <Route exact path="/orders" component={Orders} />
                        <Route
                          exact
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
    );
  }
}

export default withCookies(App);
