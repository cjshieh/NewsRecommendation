import { newsConstants } from "../constants";

export function preference(state = {}, action) {
  switch (action.type) {
    case newsConstants.STORE_SUCCESS:
      return {};
    default:
      return state;
  }
}