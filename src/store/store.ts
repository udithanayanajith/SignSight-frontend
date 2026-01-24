import { configureStore } from "@reduxjs/toolkit";
import questionSlice from "./slices/questionSlice";

export const store = configureStore({
  reducer: {
    questions: questionSlice,
    // Add more reducers here as your app grows
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
