import { newsConstants } from "../constants";

const initialState = { allLoaded: false, news: [] };
export function loader(state = initialState, action) {
  switch (action.type) {
    case newsConstants.LOAD_SUCCESS:
      return {
        allLoaded: state.allLoaded,
        news: state.news.concat(action.data.news)
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
