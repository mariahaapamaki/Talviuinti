import { SET_CURRENT_USER } from "../context/Auth.actions";
import isEmpty from "../common/isEmpty";

export default function (state: any, action: any) {
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log("Reducer SET_CURRENT_USER action:", action);
      return {
        ...state,
        isAuthenticate: !isEmpty(action.payload),
        user: action.payload,
        userProfile: action.userProfile
      };
    default:
      return state;
  }
}


