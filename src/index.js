/* global Raven */

import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "apollo-link-context";
import { CookiesProvider } from "react-cookie";
import Cookies from "universal-cookie";
import { ToastProvider } from "react-toast-notifications";

import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
LogRocket.init("5ox9mo/project-groceries");
setupLogRocketReact(LogRocket);

LogRocket.getSessionURL(function(sessionURL) {
  Raven.setDataCallback(function(data) {
    data.extra.sessionURL = sessionURL;
    return data;
  });
});

/*
 * to be used by the wsLink and authLink
 */
const cookies = new Cookies();
const token = cookies.get("token");

const httpLink = createHttpLink({
  uri: "https://project-groceries-graphql-dev.herokuapp.com/"
});

const wsLink = new WebSocketLink({
  uri: "wss://project-groceries-graphql-dev.herokuapp.com/",
  options: {
    reconnect: true,
    connectionParams: {
      // authToken: localStorage.getItem(AUTH_TOKEN)
      authToken: token
    }
  }
});

const routeLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem(AUTH_TOKEN);
  const token = cookies.get("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      throw new Error(` [GraphQL Error]: ${message}`);
    });
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    throw new Error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, routeLink]),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <CookiesProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CookiesProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();

window.Intercom("boot", {
  app_id: "e1sx7dly"
});
