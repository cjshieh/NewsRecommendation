import { newsConstants } from "../constants";
import { newsClass } from "../constants";
import _ from "lodash";

const initialState = {};
initialState[newsClass.USER] = {
  allLoaded: false,
  news: {}
};
initialState[newsClass.DEFAULT] = { news: [] };

export function loader(state = initialState, action) {
  switch (action.type) {
    case newsConstants.LOAD_SUCCESS:
      const nextState = { ...state };
      if (action.data.class === newsClass.DEFAULT) {
        nextState[newsClass.DEFAULT]["news"] = action.data.news;
      } else {
        nextState[action.data.class]["news"] = {
          ...state[action.data.class]["news"],
          ..._.mapKeys(action.data.news, "digest")
        };
      }
      return nextState;
    case newsConstants.LOAD_ALL_SUCCESS:
      const newState = { ...state };
      newState[newsClass.USER]["allLoaded"] = true;
      return newState;
    case newsConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}
