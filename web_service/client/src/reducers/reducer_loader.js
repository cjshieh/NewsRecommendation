import { newsConstants } from "../constants";
import { newsClass } from "../constants";
import _ from "lodash";

const initialState = {};
initialState[newsClass.USER] = {
  allLoaded: false,
  news: {}
};
initialState[newsClass.SEARCH] = { news: [] };
initialState[newsClass.DEFAULT] = { news: [] };

export function loader(state = initialState, action) {
  switch (action.type) {
    case newsConstants.LOAD_SUCCESS: {
      const nextState = { ...state };
      if (action.data.class === newsClass.DEFAULT) {
        nextState[newsClass.DEFAULT]["news"] = action.data.news;
      } else if (action.data.class === newsClass.USER) {
        nextState[action.data.class]["news"] = {
          ...state[action.data.class]["news"],
          ..._.mapKeys(action.data.news, "digest")
        };
      } else if (action.data.class === newsClass.SEARCH) {
        nextState[action.data.class]["news"] = state[action.data.class][
          "news"
        ].concat(action.data.news);
      }
      return nextState;
    }
    case newsConstants.LOAD_ALL_SUCCESS: {
      const nextState = { ...state };
      nextState[newsClass.USER]["allLoaded"] = true;
      return nextState;
    }
    case newsConstants.CLEAR_REQUEST: {
      const nextState = { ...state };
      nextState[newsClass.SEARCH]["news"] = [];
      return nextState;
    }
    case newsConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}
