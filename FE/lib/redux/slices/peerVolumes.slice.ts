import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PeerVolumeState {
  [peerId: string]: number;
}

const initialState: PeerVolumeState = {};

export const peerVolumesSlice = createSlice({
  name: "peerVolumes",
  initialState,
  reducers: {
    setPeerVolume: (
      state,
      action: PayloadAction<{
        peerId: string;
        volume: number;
      }>
    ) => {
      const { peerId, volume } = action.payload;

      state[peerId] = volume;
    },
  },
});

export const { setPeerVolume } = peerVolumesSlice.actions;

export default peerVolumesSlice.reducer;
