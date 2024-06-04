import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      userId: "",
      name: "",
      email: "",
      status: "",
      picture: "",
      token: "",
    },
    onlineUsers: [],
    language: "en",
  },
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
    },
    storeOnlineusers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    updateUser: (state, action) => {
      const { name, status, picture } = action.payload;

      state.user = { ...state.user, name, status, picture };
    },

    logoutUser: (state) => {
      state.user = {
        userId: "",
        name: "",
        email: "",
        status: "",
        picture: "",
        token: "",
      };
      state.onlineUsers = [];
      state.language = "en";
    },
    setlanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});
export const {
  registerUser,
  storeOnlineusers,
  updateUser,
  logoutUser,
  setlanguage,
} = userSlice.actions;
export default userSlice.reducer;
