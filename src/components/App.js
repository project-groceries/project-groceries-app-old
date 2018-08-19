import React, { Component } from "react";
// import logo from "../logo.svg"
// import "../styles/App.css"
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = this.props;
    this.state = {
      hasToken: cookies.get("token") || null
    };
  }

  componentWillUpdate() {
    console.log("THIS COMPONENT WILL UPDATE");
  }

  render() {
    return this.state.hasToken ? (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
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
