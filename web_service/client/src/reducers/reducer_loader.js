import { loadConstants } from '../constants';

export function loader(state = [], action) {
    switch(action.type) {
        case loadConstants.LOAD_SUCCESS:
            console.log(action.news);
            return state.concat(action.news);
        case loadConstants.LOAD_FAILURE:
            return state;
        default:
            return state;
    }
}