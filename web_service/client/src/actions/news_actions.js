import { alertActions } from '.';
import { newsConstants } from '../constants';
import { newsService } from '../services/news_service';

export const newsActions = {
    loadAll,
    loadByPage,
    storeBehaviour
    // TODO: add these two actions
    //loadByCategory,
    //loadByQuery
};

function loadAll() {
    console.log("action get called");
    return dispatch => {
        newsService.loadAll()
            .then(
                news => {
                    dispatch(success(news));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(news) { return { type: newsConstants.LOAD_SUCCESS, news } }
    function failure(error) { return { type: newsConstants.LOAD_FAILURE, error } }
}

function loadByPage(pageNum) {
    return dispatch => {
        newsService.loadByPage(pageNum)
            .then(
                data => {
                    data.allLoaded ? dispatch(done()) : dispatch(success(data))
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function done() {return {type: newsConstants.LOAD_ALL_SUCCESS }}
    function success(data) { return { type: newsConstants.LOAD_SUCCESS, data } }
    function failure(error) { return { type: newsConstants.LOAD_FAILURE, error } }
}

function storeBehaviour(newsId) {
    console.log("store behiour requests!");
    newsService.storeBehaviour(newsId);
    return {type: newsConstants.STORE_SUCCESS }
}