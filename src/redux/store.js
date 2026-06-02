import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice";

const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// Redux Persist config
const persistConfig = {
  key: "crm-root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore persistence actions for serializability
      },
    }),
});

export const persistor = persistStore(store);
