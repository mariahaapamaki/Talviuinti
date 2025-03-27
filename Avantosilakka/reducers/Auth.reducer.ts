import { SET_CURRENT_USER } from "../context/Auth.actions";
import isEmpty from "../common/isEmpty";

export const initialState = {
  isAuthenticate: false,
  user: null,
  userProfile: null,
};

interface Action {
  type: string;
  payload?: any;
  userProfile?: any;
}

export default function authReducer(state = initialState, action: Action) {
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

    


