const initState = {
  authError: null
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      console.log("login error");
      return { ...state, authError: "Login Error" };
    case "LOGIN_SUCCESS":
      console.log("login success");
      return {
        ...state,
        authError: null
      };
    case "SIGNOUT_SUCCESS":
      console.log("logout success");
      window.location.replace("/signin");
      return state;
    case "SIGNUP_SUCCESS":
      console.log("signup success");
      return { ...state, authError: null };
    case "SIGNUP_ERROR":
      console.log("signup error");
      return {
        ...state,
        authError: action.err.message
      };
    case "ANON_SIGNUP_SUCCESS":
      console.log("signup success");
      return { ...state, authError: null };
    case "ANON_SIGNUP_ERROR":
      console.log("signup error");
      return {
        ...state,
        authError: action.err.message
      };
    case "UPDATE_AVATAR_SUCCESS":
      console.log("Avatar updated");
      return { ...state };
    case "UPDATE_AVATAR_ERROR":
      console.log("Avatar update failed");
      return { ...state };
    case "UPGRADE_ANON_SUCCESS":
      return { ...state };
    case "UPGRADE_ANON_ERROR":
      return { ...state, authError: action.err };

    default:
      return state;
  }
};

export default authReducer;
