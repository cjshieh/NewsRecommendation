import { loadConstants } from "../constants";

const initialState = { allLoaded: false, news: [] };
export function loader(state = initialState, action) {
  switch (action.type) {
    case loadConstants.LOAD_SUCCESS:
      return {
        allLoaded: state.allLoaded,
        news: state.news.concat(action.data.news)
      };
    case loadConstants.LOAD_ALL_SUCCESS:
      return {
        allLoaded: true,
        news: state.news
      }
    case loadConstants.LOAD_FAILURE:
      return state;
    default:
      return state;
  }
}
