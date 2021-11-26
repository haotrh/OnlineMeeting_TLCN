import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PeerVolumeState {
  [key: string]: number;
}

const initialState: PeerVolumeState = {};

export const peerVolumeSlice = createSlice({
  name: "peers",
  initialState,
  reducers: {
    setPeerVolume: (
      state,
      action: PayloadAction<{ peerId: string; volume: number }>
    ) => {
      const { peerId, volume } = action.payload;

      if (state[peerId] !== volume) state[peerId] = volume;
    },
  },
});

export const { setPeerVolume } = peerVolumeSlice.actions;

export default peerVolumeSlice.reducer;
