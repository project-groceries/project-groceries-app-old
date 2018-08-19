import React, { Component } from "react";
// import { AUTH_TOKEN } from "../constants";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name, type: "STUDENT") {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const fullPageBackgroundStyles = {
  minHeight: "100vh",
  backgroundPosition: "center",
  backgroundSize: "cover"
};

const flexCenterStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const wrapperStyles = {
  ...fullPageBackgroundStyles,
  ...flexCenterStyles,
  flexDirection: "column",
  backgroundImage:
    "url('https://s3-ap-southeast-2.amazonaws.com/project-groceries-test0/login.jpg')"
};

class Login extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      login: true, // switch between Login and SignUp
      email: "",
      password: "",
      name: "",
      error: false,
      loading: false
    };
  }

  render() {
    const { login, email, password, name, error, loading } = this.state;
    return (
      <div style={wrapperStyles}>
        {loading ? <p>loading...</p> : ""}
        {error ? (
          <p style={{ color: "red" }}>Incorrect details provided</p>
        ) : (
          ""
        )}
        <h4>{login ? "Login" : "Sign Up"}</h4>
        <div style={{ display: "flex", flexDirection: "column" }} />
        <div>
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
            onError={error => this._announceError(error)}
          >
            {mutation => (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  this.setState({ loading: true });
                  mutation();
                }}
                // style={{ display: "flex", flexDirection: "column" }}
              >
                {!login && (
                  <div className="form__group">
                    <label for="name">Name</label>
                    <input
                      id="name"
                      value={name}
                      onChange={e => this.setState({ name: e.target.value })}
                      type="text"
                      placeholder="First Last"
                    />
                  </div>
                )}
                <div className="form__group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    value={email}
                    onChange={e => this.setState({ email: e.target.value })}
                    type="email"
                    placeholder="first@example.com"
                  />
                </div>
                <div className="form__group">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                    type="password"
                    placeholder="******"
                  />
                </div>
                <input
                  type="submit"
                  value={login ? "login" : "create account"}
                />
              </form>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? "need to create an account?" : "already have an account?"}
          </div>
        </div>
      </div>
    );
  }

  _announceError = async (/*error*/) => {
    this.setState({ error: true, loading: false });
  };

  _confirm = async data => {
    this.setState({ loading: false });
    const { token } = this.state.login ? data.login : data.signup;
    this._saveUserData(token);
    this.forceUpdate();
    window.location.reload();
    // this.props.history.push("/");
  };

  _saveUserData = token => {
    const { cookies } = this.props;

    // localStorage.setItem(AUTH_TOKEN, token);
    cookies.set("token", token, { path: "/" });
  };
}

export default withCookies(Login);
