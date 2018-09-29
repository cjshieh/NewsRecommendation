import { combineReducers } from 'redux';
import DrawerReduecer from './reducer_toggle_drawer';
import { alert } from './reducer_alert';
import { authentication } from './reducer_authentication';
import { loader } from './reducer_loader';
import { registration} from './reducer_registration';
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    toggle: DrawerReduecer,
    alert,
    authentication,
    loader,
    registration
});

export default rootReducer;