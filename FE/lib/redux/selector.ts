import { RootState } from "./store";

const spotlightsLengthSelector = (state: RootState) =>
  state.room.spotlights.length;

