import {
  SET_TOKEN,
  REMOVE_TOKEN,
  SET_USER,
  REMOVE_USER
} from "../actions/authentication";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }

    case SET_USER: {
      return {
        ...state,
        user: {...action.user},
      };
    }

    case REMOVE_TOKEN: {
      const nextState = { ...state };
      delete nextState.token;
      return nextState;
    }

    case REMOVE_USER: {
      const nextState = { ...state };
      delete nextState.user;
      return nextState;
    }

    default:
      return state;
  }
};

export default authReducer;
