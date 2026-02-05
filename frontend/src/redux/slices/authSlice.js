import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authMode: "Signup", // optional but useful
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {   // ✅ MUST be reducers
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    updateFavourites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload;
      }
    },

    switchAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
  },
});

// ✅ EXPORT ALL ACTIONS (including switchAuthMode)
export const {
  setLoading,
  setUser,
  setError,
  clearError,
  logout,
  updateFavourites,
  switchAuthMode,
} = authSlice.actions;

export default authSlice.reducer;
