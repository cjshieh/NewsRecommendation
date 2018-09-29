import { alertActions } from './';
import { loadConstants } from '../constants/load_constants';
import { loadService } from '../services/loader_service';

export const loadActions = {
    loadAll
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
                    console.log(news);
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
