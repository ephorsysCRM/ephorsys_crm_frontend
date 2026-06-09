import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // -----------------------------------------
    // Start Loading
    // -----------------------------------------
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // -----------------------------------------
    // Login Success
    // -----------------------------------------
    loginSuccess: (state, action) => {
      state.loading = false;
      state.admin = action.payload;
      state.role = action.payload.role || null;
      state.isAuthenticated = true;
    },

    // -----------------------------------------
    // Auth Failed
    // -----------------------------------------
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // -----------------------------------------
    // Logout
    // -----------------------------------------
    logoutSuccess: (state) => {
      state.admin = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
});

// =============================================
// Export Actions
// =============================================

export const {
  authStart,
  loginSuccess,
  authFailure,
  logoutSuccess,
} = authSlice.actions;

// =============================================
// Export Reducer
// =============================================

export default authSlice.reducer;