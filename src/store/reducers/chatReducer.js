const initState = {
  activeChat: {}
};

const chatReducer = (state = initState, action) => {
  switch (action.type) {
    case "SEND_CHAT_SUCCESS":
      console.log("send sent");
      return {
        ...state,
        activeChat: action.data
      };
    case "SEND_CHAT_ERROR":
      console.log("send failed", action.err.message);
      return {
        ...state
      };
    case "CREATE_CHATMAP_SUCCESS":
        console.log(action.data)
      return {
        ...state,
        activeChat: action.data
      };
    case "CREATE_CHATMAP_ERROR":
      console.log("chatmap failed", action.err.message);
      return {
        ...state
      };
    case "UPDATE_ACTIVECHAT":
      return {
        ...state,
        activeChat: action.data
      };
    default:
      return state;
  }
};

export default chatReducer;
