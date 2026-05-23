import api from "../../services/api";
import {
  authFailure,
  authStart,
  loginSuccess,
  logoutSuccess,
} from "./authSlice";
import toast from "react-hot-toast";

// ---------------------------------------------
// Login Admin
// ---------------------------------------------
export const loginAdmin = (formData) => async (dispatch) => {
  try {
    dispatch(authStart());
    const { data } = await api.post("/admin/login", formData);
    toast.success(data.message || "Login successful");
    dispatch(loginSuccess(data.data));
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
    dispatch(authFailure(msg));
  }
};

// ---------------------------------------------
// Logout Admin
// ---------------------------------------------
export const logOutAdmin = () => async (dispatch) => {
  try {
    const { data } = await api.post("/admin/logout");
    toast.success(data.message || "Logged out successfully");
    dispatch(logoutSuccess());
  } catch (error) {
    const msg = error.response?.data?.message || "Logout failed";
    toast.error(msg);
  }
};