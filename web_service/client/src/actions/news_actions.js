// import { alertActions } from '.';
import { newsConstants, newsClass } from "../constants";
import { newsService } from "../services/news_service";

export const newsActions = {
  clearSearchResult,
  loadNewsByDefault,
  loadByPageForUser,
  loadBySearchKey,
  loadFirstRequest,
  storeBehaviour
  // TODO: add these two actions
  //loadByCategory,
};

function clearSearchResult() {
  return {
    type: newsConstants.CLEAR_REQUEST
  };
}

function loadFirstRequest() {
  return {
    type: newsConstants.FIRST_LOAD_REQUEST
  };
}

function loadNewsByDefault() {
  return dispatch => {
    newsService.loadNewsByDefault().then(
      data => {
        dispatch(success(data));
      },
      error => {
        dispatch(failure(error.toString()));
        // dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function success(data) {
    return { type: newsConstants.LOAD_SUCCESS, data };
  }
  function failure(error) {
    return { type: newsConstants.LOAD_FAILURE, error };
  }
}

function loadBySearchKey(query, pageNum = 1) {
  return dispatch => {
    dispatch(request(newsClass.SEARCH));
    newsService.loadBySearchKey(query, pageNum).then(
      data => {
        dispatch(success(data));
      },
      error => {
        dispatch(failure(error.toString()));
        // dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(type) {
    return { type: newsConstants.LOAD_REQUEST, payload: type };
  }
  function success(data) {
    return { type: newsConstants.LOAD_SUCCESS, data };
  }
  function failure(error) {
    return { type: newsConstants.LOAD_FAILURE, error };
  }
}

function loadByPageForUser(pageNum = 1) {
  return dispatch => {
    dispatch(request(newsClass.USER));
    newsService.loadByPageForUser(pageNum).then(
      data => {
        data.allLoaded ? dispatch(done()) : dispatch(success(data));
      },
      error => {
        dispatch(failure(error.toString()));
        // dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function done() {
    return { type: newsConstants.LOAD_ALL_SUCCESS };
  }
  function request(type) {
    return { type: newsConstants.LOAD_REQUEST, payload: type };
  }
  function success(data) {
    return { type: newsConstants.LOAD_SUCCESS, data };
  }
  function failure(error) {
    return { type: newsConstants.LOAD_FAILURE, error };
  }
}

function storeBehaviour(newsId) {
  newsService.storeBehaviour(newsId);
  return { type: newsConstants.STORE_SUCCESS };
}
