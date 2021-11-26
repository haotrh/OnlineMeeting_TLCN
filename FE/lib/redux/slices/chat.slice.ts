import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  message: string;
  peerId: string;
  name: string;
  picture: string;
  timestamp: string;
}

const initialState: Message[] = [];

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      return [...state, action.payload];
    },

    clearChat: () => {
      return [];
    },
  },
});

export const { addMessage, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
