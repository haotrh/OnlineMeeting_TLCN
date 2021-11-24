import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../../types/room.type";

const initialState: Question[] = [];

export const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
});

export const {} = pollsSlice.actions;

export default pollsSlice.reducer;
