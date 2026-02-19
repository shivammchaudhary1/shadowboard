import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

// Export store for use in components
export default store;
