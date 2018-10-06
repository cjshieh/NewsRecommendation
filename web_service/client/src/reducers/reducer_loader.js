import { newsConstants } from "../constants";
import _ from "lodash";

const initialState = { allLoaded: false, news: {} };
export function loader(state = initialState, action) {
  switch (action.type) {
    case newsConstants.LOAD_SUCCESS:
      console.log(_.mapKeys(action.data.news, 'digest'));
      return {
        allLoaded: state.allLoaded,
        news: {...state.news, ..._.mapKeys(action.data.news, 'digest')}
      };
    case newsConstants.LOAD_ALL_SUCCESS:
      return {
        allLoaded: true,
        news: state.news
      }
    case newsConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}
