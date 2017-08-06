import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import decode from "jwt-decode";

import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import Book from "./Book";
import PageNotFound from "./PageNotFound";

const checkAuth = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || !refreshToken) {
    return false;
  }

  try {
    // { exp: 12903819203 }
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const AuthRoute = ({ component: Component, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      checkAuth()
        ? <Component {...props} />
        : <Redirect to={{ pathname: "/login" }} />}
  />;

export default () =>
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={props => <Login {...props} />} />
      <Route exact path="/register" render={props => <Register {...props} />} />
      <Route exact path="/book/:id" render={props => <Book {...props} />} />
      <Route exact path="/404" component={PageNotFound} />
      <AuthRoute exact path="/auth" component={Auth} />
    </Switch>
  </BrowserRouter>;
