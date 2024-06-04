import { createSlice } from "@reduxjs/toolkit";
const photoSlice = createSlice({
  name: "photo",
  initialState: {
    file: "",
    default: false,
    isGroup: false,
  },
  reducers: {
    updatePhoto: (state, action) => {
      state.file = action.payload.file;
      state.default = action.payload.default;
      state.isGroup = action.payload.isGroup;
    },
  },
});
export const { updatePhoto } = photoSlice.actions;
export default photoSlice.reducer;
