import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";

import "./index.css";
import Stock from "./components/Stock";
import Tools from "./components/Tools";
import Nav from "./components/nav";

import * as serviceWorker from "./serviceWorker";

const persistedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : {};
const store = createStore(reducer, persistedState);

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Nav />
        <Route exact path="/" component={Stock} />
        <Route path="/tools" component={Tools} />
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
