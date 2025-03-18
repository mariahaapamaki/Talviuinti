import { SET_CURRENT_USER } from "../context/Auth.actions";
import isEmpty from "../common/isEmpty";

const initialState = {
  isAuthenticate: false,
  user: null,
  userProfile: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticate: !isEmpty(action.payload),
        user: action.payload,
        userProfile: action.userProfile,
      };
    default:
      return state;
    }}




