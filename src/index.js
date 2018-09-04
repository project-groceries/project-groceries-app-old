import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "apollo-link-context";
import { CookiesProvider } from "react-cookie";
import Cookies from "universal-cookie";
import { ToastProvider } from "react-toast-notifications";

const httpLink = createHttpLink({
  uri: "https://project-groceries-graphql-dev.herokuapp.com/"
});

const authLink = setContext((_, { headers }) => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  // const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
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
