import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";

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
      fields={mapStateToProps(store.getState())}
      actions={mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
