import { combineReducers } from 'redux';
import DrawerReduecer from './reducer_toggle_drawer';
import { alert } from './reducer_alert';
import { authentication } from './reducer_authentication';
import { loader } from './reducer_loader';
import { registration} from './reducer_registration';
import { preference } from './reducer_preference';
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    toggle: DrawerReduecer,
    alert,
    authentication,
    loader,
    registration,
    preference
});

export default rootReducer;