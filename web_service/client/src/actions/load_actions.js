import { alertActions } from './';
import { loadConstants } from '../constants/load_constants';
import { loadService } from '../services/loader_service';

export const loadActions = {
    loadAll,
    loadByPage
    // TODO: add these two actions
    //loadByCategory,
    //loadByQuery
};

function loadAll() {
    console.log("action get called");
    return dispatch => {
        loadService.loadAll()
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

    function success(news) { return { type: loadConstants.LOAD_SUCCESS, news } }
    function failure(error) { return { type: loadConstants.LOAD_FAILURE, error } }
}

function loadByPage(pageNum) {
    return dispatch => {
        loadService.loadByPage(pageNum)
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

    function done() {return {type: loadConstants.LOAD_ALL_SUCCESS }}
    function success(data) { return { type: loadConstants.LOAD_SUCCESS, data } }
    function failure(error) { return { type: loadConstants.LOAD_FAILURE, error } }
}