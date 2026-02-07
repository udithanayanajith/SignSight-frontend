// src/store/questionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Answer = {
  question_id: string;
  correct_answer: string;
  user_answer: string;
  area: string;
};

type Level = "basic" | "intermediate" | "advanced";
type Category = "category_1" | "category_2" | "category_3" | "category_4";

type QuestionState = {
  answers: {
    basic: Record<string, Answer[]>;
    intermediate: Record<string, Answer[]>;
    advanced: Record<string, Answer[]>;
  };
};

const initialState: QuestionState = {
  answers: {
    basic: {
      category_1: [],
      category_2: [],
    },
    intermediate: {
      category_2: [],
      category_3: [],
    },
    advanced: {
      category_3: [],
      category_4: [],
    },
  },
};

type AddAnswerPayload = {
  level: Level;
  category: Category;
  question_id: string;
  correct_answer: string;
  user_answer: string;
  area: string;
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addAnswerForQuestion: (state, action: PayloadAction<AddAnswerPayload>) => {
      const { level, category, ...answer } = action.payload;

      // prevent duplicates (important!)
      const existing = state.answers[level][category].find(
        (a) => a.question_id === answer.question_id,
      );

      if (!existing) {
        state.answers[level][category].push(answer);
      }
    },

    resetAnswers: () => initialState,
  },
});

export const { addAnswerForQuestion, resetAnswers } = questionSlice.actions;
export default questionSlice.reducer;
