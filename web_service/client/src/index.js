import React from "react";
import ReactDOM from "react-dom";

import App from "./component/app";
import Login from "./component/login/login";

import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <Login />
  </Provider>,
  document.querySelector("#root")
);