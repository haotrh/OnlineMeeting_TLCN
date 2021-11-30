import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Peer } from "../../../types/room.type";

export interface PeersState {
  [authId: number]: Peer;
}

const initialState: PeersState = {};

export const requestPeersSlice = createSlice({
  name: "requestPeers",
  initialState,
  reducers: {
    addRequestPeer: (state, action: PayloadAction<{ peer: Peer }>) => {
      const { peer } = action.payload;

      state[peer.authId] = peer;
    },

    addRequestPeers: (state, action: PayloadAction<{ peers: Peer[] }>) => {
      const { peers } = action.payload;

      peers.forEach((peer) => {
        state[peer.authId] = peer;
      });
    },

    removeRequestPeer: (
      state,
      action: PayloadAction<{ peerAuthId: number }>
    ) => {
      delete state[action.payload.peerAuthId];
    },

    clearRequestPeer: () => {
      return {};
    },
  },
});

export const {
  addRequestPeer,
  addRequestPeers,
  removeRequestPeer,
  clearRequestPeer,
} = requestPeersSlice.actions;

export default requestPeersSlice.reducer;
