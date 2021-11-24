import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, QuestionReply } from "../../../types/room.type";

interface QuestionState {
  [questionId: string]: Question;
}

const initialState: QuestionState = {};

export const questionsSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    addQuestions: (state, action: PayloadAction<Question[]>) => {
      const questions = action.payload;

      for (const question of questions) {
        state[question.id] = question;
      }
    },

    addQuestion: (state, action: PayloadAction<Question>) => {
      const question = action.payload;

      state[question.id] = question;
    },

    upvoteQuestion: (
      state,
      action: PayloadAction<{
        questionId: string;
        upvotes: number;
        isVoted: boolean;
      }>
    ) => {
      const { questionId, upvotes, isVoted } = action.payload;

      state[questionId].isVoted = isVoted;
      state[questionId].upvotes = upvotes;
    },

    replyQuestion: (
      state,
      action: PayloadAction<{ questionId: string; reply: QuestionReply }>
    ) => {
      const { questionId, reply } = action.payload;

      state[questionId].reply = reply;
      state[questionId].isClosed = true;
    },

    removeQuestion: (state, action: PayloadAction<{ questionId: string }>) => {
      delete state[action.payload.questionId];
    },

    clearQuestion: () => {
      return {};
    },
  },
});

export const {
  addQuestion,
  clearQuestion,
  addQuestions,
  removeQuestion,
  replyQuestion,
  upvoteQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
