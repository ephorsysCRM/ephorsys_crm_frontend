import { configureStore } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";

import createWebStorage from "redux-persist/es/storage/createWebStorage";

import rootReducer from "./rootReducer";

// =============================================
// Create Storage
// =============================================

const storage = createWebStorage("local");

// =============================================
// Persist Config
// =============================================

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// =============================================
// Persist Reducer
// =============================================

const persistedReducer = persistReducer(persistConfig, rootReducer);

// =============================================
// Store
// =============================================

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// =============================================
// Persistor
// =============================================

export const persistor = persistStore(store);
