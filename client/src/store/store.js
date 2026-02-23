import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import gameReducer from "./slices/gameSlice";
import voteReducer from "./slices/voteSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    auth: authReducer,
    room: roomReducer,
    game: gameReducer,
    vote: voteReducer,
  },
});

// Export store for use in components
export default store;
