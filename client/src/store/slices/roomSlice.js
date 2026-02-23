/**
 * Room slice - room data and members for lobby/room views
 * Can be used for caching room state across components
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRoom: null,
  members: [],
  userRole: null,
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomData: (state, action) => {
      const { room, members, userRole } = action.payload;
      state.currentRoom = room;
      state.members = members || [];
      state.userRole = userRole || null;
      state.error = null;
    },
    setRoomLoading: (state, action) => {
      state.loading = action.payload ?? true;
    },
    setRoomError: (state, action) => {
      state.error = action.payload;
    },
    clearRoom: (state) => {
      state.currentRoom = null;
      state.members = [];
      state.userRole = null;
    },
  },
});

export const { setRoomData, setRoomLoading, setRoomError, clearRoom } =
  roomSlice.actions;
export default roomSlice.reducer;
