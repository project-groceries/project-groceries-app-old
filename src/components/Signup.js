/* global mixpanel */

import React, { Component } from "react";
// import { AUTH_TOKEN } from "../constants";
import { Mutation } from "react-apollo";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { SIGNUP_MUTATION } from "../queries";

import UndrawMaintenance from "./svg/UndrawMaintenance";
import { css } from "emotion";

class Login extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
      error: false,
      errorMessage: "---",
      success: false,
      loading: false
    };
  }

  render() {
    const { history } = this.props;
    const {
      email,
      password,
      name,
      error,
      errorMessage,
      success,
      loading
    } = this.state;

    return (
      <div
        className="viewport-container background-image"
        style={{
          backgroundImage:
            "url('https://s3-ap-southeast-2.amazonaws.com/project-groceries-test0/register.jpg')"
        }}
      >
        <nav className="bar">
          <svg
            className="favicon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 550 550"
            fill="#83c673"
          >
            <path
              className="handle"
              d="M275 79.2a81.2 81.2 0 0 1 81.2 81.2h22.3a103.5 103.5 0 1 0-207 0h22.3A81.2 81.2 0 0 1 275 79.2z"
            />
            <path className="bag" d="M39.3 493.1h471.3V160.4H39.3" />
          </svg>
          {/* <div id="title">
            <h1 className="display-w-lg title__text">Sign Up</h1>
            <h3 className="display-w-md title__text">Sign Up</h3>
          </div> */}
          <div className="btn default" onClick={() => history.push("/login")}>
            Log In
          </div>
        </nav>

        <main className="flex-center">
          <div
            className={css`
              background-color: white;
              box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
              width: 400px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 10px;

              @media (max-width: 400px) {
                width: 100%;
                height: 100%;
              }

              & > * {
                margin: 10px;
              }
            `}
          >
            <h1>Uh Oh</h1>
            <img src="./UndrawMaintenance.svg" width="200px" alt="" />
            <p>
              The signup page is not working at the moment. We have discovered
              some issues and are working to fix them. Apologies for any
              inconvenience.
            </p>
            <p>
              If you would like to be notified when you can sign up, send an
              email to hemedi@projectgroceries.com and we will inform you when
              this page is back up and running
            </p>
          </div>
          {/* <div className="card card--w-fluid">
            {error ? (
              <small id="incorrect" className="card warning">
                {errorMessage}
              </small>
            ) : (
              ""
            )}

            {loading ? (
              <div id="spinner" className="card">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </div>
            ) : (
              ""
            )}

            {success ? (
              <div id="correct" className="card column">
                <h1>
                  <span role="img" aria-label="Thumbs Up">
                    👍
                  </span>
                </h1>
                <small>You're In</small>
              </div>
            ) : (
              <Mutation
                mutation={SIGNUP_MUTATION}
                variables={{ email, password, name }}
                onCompleted={data => this._confirm(data)}
                // update={data => this._confirm(data)}
                onError={error => this._announceError(error)}
              >
                {mutation => (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      this.setState({
                        success: false,
                        error: false,
                        loading: true
                      });
                      mutation();
                    }}
                  >
                    <div className="form__group">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="First Last"
                        required={true}
                      />
                    </div>
                    <div className="form__group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        value={email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="email"
                        placeholder="first@example.com"
                        required={true}
                      />
                    </div>
                    <div className="form__group">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        value={password}
                        onChange={e =>
                          this.setState({ password: e.target.value })
                        }
                        type="password"
                        placeholder="******"
                        required={true}
                      />
                    </div>
                    <input
                      className="btn info"
                      type="submit"
                      value={"Create Account"}
                    />
                  </form>
                )}
              </Mutation>
            )}
          </div> */}
        </main>

        {/* <footer className="bar">
          <span />
          <a
            style={{
              backgroundColor: "black",
              color: "white",
              textDecoration: "none",
              padding: "4px 6px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              lineHeight: "1.2",
              display: "inline-block",
              borderRadius: "3px"
            }}
            href="https://unsplash.com/@benchaccounting?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
            target="_blank"
            rel="noopener noreferrer"
            title="Download free do whatever you want high-resolution photos from Bench Accounting"
          >
            <span style={{ display: "inline-block", padding: "2px 3px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  height: "12px",
                  width: "auto",
                  position: "relative",
                  verticalAlign: "middle",
                  top: "-1px",
                  fill: "white"
                }}
                viewBox="0 0 32 32"
              >
                <title>unsplash-logo</title>
                <path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z" />
              </svg>
            </span>
            <span style={{ display: "inline-block", padding: "2px 3px" }}>
              Bench Accounting
            </span>
          </a>
          <span />
        </footer> */}
      </div>
    );
  }

  _announceError = async error => {
    let errorMessage = error.message.replace("GraphQL error: ", "");
    if (
      errorMessage ===
      "A unique constraint would be violated on User. Details: Field name = email"
    ) {
      errorMessage = "Account already created";
    }
    this.setState({
      error: true,
      errorMessage,
      loading: false
    });
  };

  _confirm = async data => {
    const { cookies } = this.props;
    const { email } = this.state;

    mixpanel.alias(email);
    mixpanel.track("Signed up");

    const { token } = data.signup;
    cookies.set("token", token, { path: "/" });

    this.setState({ success: true, loading: false });
  };
}

export default withCookies(Login);
