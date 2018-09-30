import { loadConstants } from "../constants";

// const initialState = { allLoaded: false, news: [] };
export function loader(state = [], action) {
  switch (action.type) {
    case loadConstants.LOAD_SUCCESS:
      return state.concat(action.data);
    case loadConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}
