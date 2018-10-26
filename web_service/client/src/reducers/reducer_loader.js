import { newsConstants } from "../constants";
import { newsClass } from "../constants";
import _ from "lodash";

export function loader(state = createInit(), action) {
  const nextState = { ...state };
  switch (action.type) {
    case newsConstants.LOAD_SUCCESS: {
      nextState[newsConstants.FIRST_LOAD_REQUEST] = false;
      nextState[action.data.class]["loading"] = false;
      if (action.data.class === newsClass.DEFAULT) {
        nextState[newsClass.DEFAULT]["news"] = action.data.news;
        return nextState;
      } else if (action.data.class === newsClass.SEARCH) {
        nextState[newsClass.SEARCH]["loaded"] = true;
      }
      nextState[action.data.class]["news"] = concatNews(
        state[action.data.class]["news"],
        action.data.news
      );
      return nextState;
    }
    case newsConstants.LOAD_ALL_SUCCESS: {
      nextState[newsClass.USER]["allLoaded"] = true;
      return nextState;
    }
    case newsConstants.LOAD_REQUEST: {
      nextState[action.payload]["loading"] = true;
      return nextState;
    }
    case newsConstants.FIRST_LOAD_REQUEST: {
      nextState[newsConstants.FIRST_LOAD_REQUEST] = true;
      return nextState;
    }
    case newsConstants.LOAD_REQUEST: {
      nextState[action.data.class]["loading"] = true;
      return nextState;
    }
    case newsConstants.CLEAR_REQUEST: {
      return createInit();
    }
    case newsConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}

function concatNews(prevState, data) {
  // console.log(data);
  if (data.length < 1) {
    console.log("no data");
    return prevState;
  }

  return {
    ...prevState,
    ..._.mapKeys(data, "digest")
  };
}

function createInit() {
  const initialState = {};
  initialState[newsConstants.FIRST_LOAD_REQUEST] = false;
  initialState[newsClass.USER] = {
    loading: false,
    allLoaded: false,
    news: {}
  };
  initialState[newsClass.SEARCH] = { loading: false, loaded: false, news: {} };
  initialState[newsClass.DEFAULT] = { news: [] };
  return initialState;
}
