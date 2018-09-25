import { combineReducers } from 'redux';
import DrawerReduecer from './reducer_toggle_drawer';
import { alert } from './reducer_alert';
import { authentication } from './reducer_authentication';
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    toggle: DrawerReduecer,
    alert,
    authentication
});

export default rootReducer;