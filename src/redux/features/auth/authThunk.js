import api from "../../../services/api";
import {
  authFailure,
  authStart,
  loginSuccess,
  logoutSuccess,
} from "./authSlice";
import toast from "react-hot-toast";
import socket from "../../../socket/socket.js";

export const loginAdmin = (formData) => async (dispatch) => {
  try {
    dispatch(authStart());
    const { data } = await api.post("/admin/login", formData);
    toast.success(data.message || "Login successful");
    dispatch(loginSuccess({ user: data.data, role: "admin" }));

    socket.connect();
    socket.emit("join", { userId: data.data._id });
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
    dispatch(authFailure(msg));
  }
};

export const loginEmployee = (formData) => async (dispatch) => {
  try {
    dispatch(authStart());
    const { data } = await api.post("/employee/login", formData);

    if (data.data.department !== "Business Development Executive") {
      toast.error("Access restricted to Business Development Executives only");
      dispatch(authFailure("Department not allowed"));
      return;
    }

    toast.success(data.message || "Login successful");
    dispatch(loginSuccess({ user: data.data, role: "employee" }));

    socket.connect();
    socket.emit("join", { userId: data.data._id });
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
    dispatch(authFailure(msg));
  }
};

export const logOutAdmin = () => async (dispatch) => {
  try {
    const { data } = await api.post("/admin/logout");
    toast.success(data.message || "Logged out successfully");
    dispatch(logoutSuccess());
    socket.disconnect();
  } catch (error) {
    dispatch(logoutSuccess());
    socket.disconnect();
    const msg = error.response?.data?.message || "Logout failed";
    toast.error(msg);
  }
};

export const logOutEmployee = () => async (dispatch) => {
  try {
    const { data } = await api.post("/employee/logout");
    toast.success(data.message || "Logged out successfully");
    dispatch(logoutSuccess());
    socket.disconnect();
  } catch (error) {
    dispatch(logoutSuccess());
    socket.disconnect();
    const msg = error.response?.data?.message || "Logout failed";
    toast.error(msg);
  }
};
