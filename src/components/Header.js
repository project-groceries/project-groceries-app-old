import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { AUTH_TOKEN } from "../constants";

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div
        style={{
          backgroundColor: "orange",
          display: "flex"
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>Hacker News</div>
          <Link to="/">new</Link>
          {authToken && (
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          )}
        </div>
        {authToken ? (
          <div
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              this.props.history.push("/");
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login">login</Link>
        )}
      </div>
    );
  }
}

export default withRouter(Header);
