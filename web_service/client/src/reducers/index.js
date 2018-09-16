import { combineReducers } from 'redux';
import DrawerReduecer from './reducer_toggle_drawer'; 
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    toggle: DrawerReduecer
});

export default rootReducer;