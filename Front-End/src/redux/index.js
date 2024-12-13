import { combineReducers } from "redux";
import userReducer from "./users/userSlice";
// import providerReducer from "./providers/providerSlice";

const rootReducer = combineReducers({
  user: userReducer,
  // providers: providerReducer,
});

export default rootReducer;
