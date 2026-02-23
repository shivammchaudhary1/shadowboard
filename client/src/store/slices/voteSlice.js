/**
 * Vote slice - voting state and results
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedId: null,
  hasVoted: false,
  results: null,
  loading: false,
  error: null,
};

const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedId = action.payload;
    },
    setHasVoted: (state, action) => {
      state.hasVoted = action.payload ?? true;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setVoteLoading: (state, action) => {
      state.loading = action.payload ?? true;
    },
    setVoteError: (state, action) => {
      state.error = action.payload;
    },
    clearVote: (state) => {
      state.selectedId = null;
      state.hasVoted = false;
      state.results = null;
    },
  },
});

export const {
  setSelectedOption,
  setHasVoted,
  setResults,
  setVoteLoading,
  setVoteError,
  clearVote,
} = voteSlice.actions;
export default voteSlice.reducer;
