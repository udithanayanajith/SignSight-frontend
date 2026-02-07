import { RootState } from "./store";

export const selectResultsByLevel =
  (level: "basic" | "intermediate" | "advanced") => (state: RootState) => ({
    level,
    ...state.questions.answers[level],
  });
