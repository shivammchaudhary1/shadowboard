/**
 * Auth slice - manages authentication state and token persistence
 */
import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  const token = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  return {
    token: token || null,
    user: userStr ? JSON.parse(userStr) : null,
    isAuthenticated: !!token,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.token = accessToken;
      state.user = user;
      state.isAuthenticated = true;
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
