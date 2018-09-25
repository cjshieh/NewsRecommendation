import React from "react";
import ReactDOM from "react-dom";

import App from "./component/app";
import LoginPage from "./component/login/login_page";
import SignupPage from "./component/signup/signup_page";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import rootReducer from "./reducers";
import thunkMiddleware from 'redux-thunk';

const store = createStore(rootReducer,applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.querySelector("#root")
);
