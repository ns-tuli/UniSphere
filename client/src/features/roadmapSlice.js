import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  roadmap: null,
  loading: false,
  error: null,
};

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setRoadmap: (state, action) => {
      state.roadmap = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentUser, setRoadmap, setLoading, setError } = roadmapSlice.actions;
export default roadmapSlice.reducer;