import { configureStore } from "@reduxjs/toolkit";
import roadmapReducer from "./features/roadmapSlice";

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
  },
});