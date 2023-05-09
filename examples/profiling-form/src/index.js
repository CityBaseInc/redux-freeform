import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";

import ProfilingForm from "./ProfilingForm";
import { mapStateToProps, reducer, mapDispatchToProps } from "./ProfilingForm.state";

const timedReducer = (...args) => {
  console.time("Reducer");
  const result = reducer(...args);
  console.timeEnd("Reducer");
  return result;
};

const store = createStore(timedReducer);
const rootEl = document.getElementById("profiling-form");
const render = () =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <ProfilingForm
      {...mapStateToProps(store.getState())}
      {...mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
