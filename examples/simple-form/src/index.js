import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";

import SimpleForm from "./SimpleForm";
import { mapStateToProps, reducer, mapDispatchToProps } from "./SimpleForm.state";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const rootEl = document.getElementById("simple-form");
const render = () =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <SimpleForm
      {...mapStateToProps(store.getState())}
      {...mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
