import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/rootReducer";
import { getFirebase } from "react-redux-firebase";
import { getFirestore, reduxFirestore } from "redux-firestore";
import { firestoreConnect } from "react-redux-firebase";
import { firebase } from "./config.js";

export default function configureStore(initialState, history) {
  const middleware = [thunk.withExtraArgument({ getFirebase, getFirestore })];
  const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware),

    typeof window === "object" &&
      typeof window.devToolsExtension !== "undefined"
      ? () => window.__REDUX_DEVTOOLS_EXTENSION__
      : f => f
  )(createStore);
  const store = createStoreWithMiddleware(rootReducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./store/reducers/rootReducer.js", () => {
      const nextRootReducer = require("./store/reducers/rootReducer");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
