import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,
  loggedIn: false,
  favoriteTracks: [] as string[],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.username = action.payload.username;
      state.loggedIn = true;
      state.userId = action.payload._id;
      state.favoriteTracks = action.payload.favoriteTracks || [];
    },
    unsetUser(state) {
      state.username = null;
      state.loggedIn = false;
      state.userId = null;
      state.favoriteTracks = [];
    },
    setFavoriteTracks(state, action) {
      state.favoriteTracks = action.payload;
    },
  },
});

export const { setUser, unsetUser, setFavoriteTracks } = usersSlice.actions;

export default usersSlice.reducer;
