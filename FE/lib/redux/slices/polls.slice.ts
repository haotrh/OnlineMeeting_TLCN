import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Poll, Question } from "../../../types/room.type";

interface PollState {
  [pollId: string]: Poll;
}

const initialState: PollState = {};

export const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    addPolls: (state, action: PayloadAction<Poll[]>) => {
      const polls = action.payload;

      for (const poll of polls) {
        state[poll.id] = poll;
      }
    },

    addPoll: (state, action: PayloadAction<Poll>) => {
      const poll = action.payload;

      state[poll.id] = poll;
    },

    closePoll: (state, action: PayloadAction<{ pollId: string }>) => {
      const poll = state[action.payload.pollId];

      if (poll) {
        poll.isClosed = true;
      }

      toast("Host has closed a poll");
    },

    openPoll: (state, action: PayloadAction<{ pollId: string }>) => {
      const poll = state[action.payload.pollId];

      if (poll) {
        poll.isClosed = false;
      }

      toast("Host has opened a poll");
    },

    removePoll: (state, action: PayloadAction<{ pollId: string }>) => {
      delete state[action.payload.pollId];

      toast("A poll has been removed");
    },

    clearPolls: () => {
      return {};
    },
  },
});

export const {
  addPoll,
  addPolls,
  clearPolls,
  closePoll,
  openPoll,
  removePoll,
} = pollsSlice.actions;

export default pollsSlice.reducer;
