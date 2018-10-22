import { combineReducers } from "redux";
import { alert } from "./reducer_alert";
import { authentication } from "./reducer_authentication";
import { loader } from "./reducer_loader";
import { interaction } from "./reducer_ui_interactions";
import { registration } from "./reducer_registration";

const rootReducer = combineReducers({
  alert,
  authentication,
  loader,
  interaction,
  registration
});

export default rootReducer;
