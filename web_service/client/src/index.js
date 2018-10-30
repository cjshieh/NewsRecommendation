import React from "react";
import ReactDOM from "react-dom";

import App from "./components/app";
import LoginPage from "./components/login/login_page";
import SignupPage from "./components/signup/signup_page";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
// watch for redux state
// import { createLogger } from "redux-logger";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import rootReducer from "./reducers";
import thunkMiddleware from "redux-thunk";

// const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware)
);

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
