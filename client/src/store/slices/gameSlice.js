/**
 * Game slice - current question, phase, and game flow state
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeQuestion: null,
  phase: "idle", // idle | voting | ended | results
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setActiveQuestion: (state, action) => {
      state.activeQuestion = action.payload;
      state.phase = action.payload ? "voting" : "idle";
      state.error = null;
    },
    setGamePhase: (state, action) => {
      state.phase = action.payload;
    },
    setGameLoading: (state, action) => {
      state.loading = action.payload ?? true;
    },
    setGameError: (state, action) => {
      state.error = action.payload;
    },
    clearGame: (state) => {
      state.activeQuestion = null;
      state.phase = "idle";
    },
  },
});

export const {
  setActiveQuestion,
  setGamePhase,
  setGameLoading,
  setGameError,
  clearGame,
} = gameSlice.actions;
export default gameSlice.reducer;
