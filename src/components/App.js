import React, { Component, Fragment } from "react";
import logo from "../logo.svg";
// import "../styles/App.css"
// import LinkList from "./LinkList";
// import CreateLink from "./CreateLink";
// import Header from "./Header";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Query } from "react-apollo";
import NoSchool from "./NoSchool";
import Logo from "./Logo";
import SamsungTVLoader from "./SamsungTVLoader";
import { USER_QUERY } from "../queries";

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
                  <img src={logo} alt="Project Groceries" height="80px" />
                  <SamsungTVLoader />
                </div>
              );
            if (error) return <div>Error</div>;

            const { name, school } = data.user;

            return (
              <Fragment>
                <section
                  style={{
                    backgroundColor: "rgba(128, 128, 128, 0.1)",
                    transition: "all 0.6s ease",
                    filter: school ? "none" : "blur(8px)",
                    pointerEvents: school ? "auto" : "none"
                  }}
                >
                  <div className="bar">
                    <Logo />
                    <h1>{name}</h1>
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
                  {school ? <div>There is a School!!</div> : <NoSchool />}
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
