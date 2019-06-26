import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import SimpleForm from "./SimpleForm";
import {
  mapStateToProps,
  reducer,
  mapDispatchToProps
} from "./SimpleForm.state";

const store = createStore(reducer);
const rootEl = document.getElementById("simple-form");
const render = () =>
  ReactDOM.render(
    <SimpleForm
      {...mapStateToProps(store.getState())}
      {...mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
