// import { createStore, applyMiddleware, compose } from "redux";
import { createStore, applyMiddleware } from "redux";
import { thunk }from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from './rootReducer';  

// let initialState = {}; 

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
);
// const store = createStore(
//   rootReducer,
//   applyMiddleware(thunk),
//   composeWithDevTools(),
// );

export default store;