import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionAnswer {
  question_id: string;
  correct_answer: string;
  area: string;
}

interface QuestionsState {
  questionAnswerList: QuestionAnswer[];
}

const initialState: QuestionsState = {
  questionAnswerList: [],
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    // Add answer - if exists, only update if correct_answer changed
    addAnswerForQuestion: (state, action: PayloadAction<QuestionAnswer>) => {
      const existingIndex = state.questionAnswerList.findIndex(
        (item) => item.question_id === action.payload.question_id,
      );

      if (existingIndex === -1) {
        // Doesn't exist - add new
        state.questionAnswerList.push(action.payload);
      } else {
        // Exists - check if correct_answer changed
        const existingItem = state.questionAnswerList[existingIndex];
        if (existingItem.correct_answer !== action.payload.correct_answer) {
          // Answer changed - update it
          state.questionAnswerList[existingIndex] = action.payload;
        }
        // If answer is the same, do nothing
      }
    },

    // ... rest of your reducers remain the same
    updateAnswerForQuestion: (state, action: PayloadAction<QuestionAnswer>) => {
      const index = state.questionAnswerList.findIndex(
        (item) => item.question_id === action.payload.question_id,
      );
      if (index !== -1) {
        state.questionAnswerList[index] = action.payload;
      }
    },

    upsertAnswerForQuestion: (state, action: PayloadAction<QuestionAnswer>) => {
      const index = state.questionAnswerList.findIndex(
        (item) => item.question_id === action.payload.question_id,
      );
      if (index !== -1) {
        state.questionAnswerList[index] = action.payload;
      } else {
        state.questionAnswerList.push(action.payload);
      }
    },

    removeAnswerForQuestion: (state, action: PayloadAction<string>) => {
      state.questionAnswerList = state.questionAnswerList.filter(
        (item) => item.question_id !== action.payload,
      );
    },

    removeMultipleAnswers: (state, action: PayloadAction<string[]>) => {
      state.questionAnswerList = state.questionAnswerList.filter(
        (item) => !action.payload.includes(item.question_id),
      );
    },

    resetAllAnswers: (state) => {
      state.questionAnswerList = [];
    },
  },
});

export const {
  addAnswerForQuestion,
  updateAnswerForQuestion,
  upsertAnswerForQuestion,
  removeAnswerForQuestion,
  removeMultipleAnswers,
  resetAllAnswers,
} = questionsSlice.actions;

export default questionsSlice.reducer;
