import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";

import ProfilingForm from "./ProfilingForm";
import {
  mapStateToProps,
  reducer,
  mapDispatchToProps
} from "./ProfilingForm.state";

const timedReducer = (...args) => {
  console.time("Reducer");
  const result = reducer(...args);
  console.timeEnd("Reducer");
  return result;
};

const store = createStore(timedReducer);
const rootEl = document.getElementById("profiling-form");
const render = () =>
  ReactDOM.render(
    <ProfilingForm
      fields={mapStateToProps(store.getState())}
      actions={mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
