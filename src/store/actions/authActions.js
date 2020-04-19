export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch(() => {
        dispatch({ type: "LOGIN_ERROR" });
      });
  };
};

export const anonSignIn = (credentials) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    firebase
      .auth()
      .signInAnonymously()
      .then((response) => {
        firestore.collection("users").doc(response.user.uid).set({
          fullName: credentials.name,
          userName: credentials.name,
          avatar: credentials.avatar,
          chatsUid: [],
        });
        getFcmToken(response.user.uid);
      })
      .then(() => {
        dispatch({ type: "ANON_SIGNUP_SUCCESS" });
      })
      .catch((err) => {
        return dispatch({ type: "ANON_SIGNUP_ERROR", err });
      });
  };
};

export const upgradeAnon = (credentials, auid) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    const cred = firebase.auth.EmailAuthProvider.credential(
      credentials.email,
      credentials.password
    );

    firebase
      .auth()
      .currentUser.linkWithCredential(cred)
      .then(function (usercred) {
        /* */

        firestore("users")
          .doc(auid)
          .update({
            realName: credentials.name,
            realUserName: credentials.name,
          })
          .then(() => {
            var user = usercred.user;
            dispatch({ type: "UPGRADE_ANON_SUCCESS", data: user });
          });
      })
      .catch(function (err) {
        dispatch({ type: "UPGRADE_ANON_ERROR", err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };
};

export const signUp = (newUser, avatar, anonName) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    const batch = firestore.batch();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((response) => {
        firestore.collection("users").doc(response.user.uid).set({
          fullName: anonName,
          userName: anonName,
          realName: newUser.name,
          realUserName: newUser.name,
          avatar: avatar,
          chatsUid: [],
        });
        getFcmToken(response.user.uid);
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch((err) => {
        return dispatch({ type: "SIGNUP_ERROR", err });
      });
  };
};

export const getFcmToken = (auid) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(
      "BEyEFNcl9LVcEku6mHI61jWxDZtx5CTevh5eXw5Ms_XTL_u_VyYCz3vmB-8MCCbuOMj1KNO6k7dHqEtggk3Ax4Y"
    );

    messaging
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          //sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);

          firestore
            .collection("users")
            .doc(auid)
            .update({
              fcmToken: currentToken,
            })
            .then(() => {
              dispatch({ type: "FCMTOKEN_SUCCESS" });
            });
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
          // Show permission UI.
          //updateUIForPushPermissionRequired();
          setTokenSentToServer(false);

          // Show permission UI.
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);

        dispatch({ type: "FCMTOKEN_ERROR" });
        //showToken("Error retrieving Instance ID token. ", err);
        setTokenSentToServer(false);
      });

    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((refreshedToken) => {
          console.log("Token refreshed.", refreshedToken);
          firestore
            .collection("users")
            .doc(auid)
            .update({
              fcmToken: refreshedToken,
            })
            .then(() => {
              dispatch({ type: "FCMTOKEN_SUCCESS" });
            });
        })
        .catch((err) => {
          console.log("Unable to retrieve refreshed token ", err);
          //showToken('Unable to retrieve refreshed token ', err);
        });
    });
  };
};

const setTokenSentToServer = (sent) => {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
};

export const delFcmToken = (auid) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firestore
      .collection("users")
      .doc(auid)
      .update({
        fcmToken: null,
      })
      .then(() => {
        dispatch({ type: "DELFCMTOKEN_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "DELFCMTOKEN_ERROR" });
      });
  };
};

export const updateAvatar = (avatar, auid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firestore
      .collection("users")
      .doc(auid)
      .update({
        avatar: avatar,
      })
      .then(() => {
        dispatch({ type: "UPDATE_AVATAR_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "UPDATE_AVATAR_ERROR" });
      });
  };
};
