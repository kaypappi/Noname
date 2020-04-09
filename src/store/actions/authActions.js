export const signIn = credentials => {
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

export const anonSignIn = credentials => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    firebase
      .auth()
      .signInAnonymously()
      .then(response => {
        return firestore
          .collection("users")
          .doc(response.user.uid)
          .set({
            fullName: credentials.name,
            userName: credentials.name,
            avatar: credentials.avatar,
            chatsUid: []
          });
      })
      .then(() => {
        dispatch({ type: "ANON_SIGNUP_SUCCESS" });
      })
      .catch(err => {
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
      .then(function(usercred) {
        /* */

        firestore("users")
          .doc(auid)
          .update({
            realName: credentials.name,
            realUserName: credentials.name
          })
          .then(() => {
            var user = usercred.user;
            dispatch({ type: "UPGRADE_ANON_SUCCESS", data: user });
          });
      })
      .catch(function(err) {
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

export const signUp = (newUser,avatar,anonName) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(response => {
        return firestore
          .collection("users")
          .doc(response.user.uid)
          .set({
            fullName: anonName,
            userName: anonName,
            realName: newUser.name,
            realUserName: newUser.name,
            avatar: avatar,
            chatsUid: []
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch(err => {
        return dispatch({ type: "SIGNUP_ERROR", err });
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
        avatar: avatar
      })
      .then(() => {
        dispatch({ type: "UPDATE_AVATAR_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "UPDATE_AVATAR_ERROR" });
      });
  };
};
