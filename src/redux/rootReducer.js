import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import employeeReducer from "./features/employeeSlice";
import leadReducer from "./features/leadSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  employee: employeeReducer,
  lead: leadReducer,
});

export default rootReducer;
