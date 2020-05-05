import React from "react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore"; // make sure you add this for firestore
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";

import configureStore from "./store";
import initFirebase from "./initFirebase";
import { reduxFirebase as rfConfig } from "./config";
import Navbar from "./components/navbar/navbar";
import Navbar2 from "./components/navbar/navbar2";
import Home from "./components/pages/home";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Dashboard from "./components/pages/dashboard/Dashboard";
import AuthGuard from "./components/auth/helpers/AuthGuard";
import Spinner from "./Assets/Spinner.gif";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//import "./App.css";

const initialState = window && window.__INITIAL_STATE__; // set initial state here
const store = configureStore(initialState);
// Initialize Firebase instance
/* initFirebase() */

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <div className="w-screen flex items-center h-screen">
        <img className='mx-auto my-auto ' style={{ width: "100px", height: "100px" }} src={Spinner} alt="" />
      </div>
    );
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider
        firebase={firebase}
        config={rfConfig}
        dispatch={store.dispatch}
        createFirestoreInstance={createFirestoreInstance}
      >
        <div className="App">
          <Router>
            <AuthIsLoaded>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route
                  exact
                  path="/user/:uid"
                  render={(props) => (
                    <AuthGuard
                      link={"/signin"}
                      component={<Dashboard {...props} />}
                    />
                  )}
                />
                <Route
                  exact
                  path="/signin"
                  render={(props) => (
                    <AuthGuard link={"/"} component={<SignIn {...props} />} />
                  )}
                />
                <Route
                  exact
                  path="/signUp"
                  render={(props) => (
                    <AuthGuard link={"/"} component={<SignUp {...props} />} />
                  )}
                />
              </Switch>
            </AuthIsLoaded>
          </Router>
        </div>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}
