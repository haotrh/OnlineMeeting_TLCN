import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Peer } from "../../../types/room.type";

export interface PeersState {
  [key: string]: Peer;
}

const initialState: PeersState = {};

export const requestPeersSlice = createSlice({
  name: "requestPeers",
  initialState,
  reducers: {
    addRequestPeer: (state, action: PayloadAction<{ peer: Peer }>) => {
      const { peer } = action.payload;

      state[peer.id] = peer;
    },

    addRequestPeers: (state, action: PayloadAction<{ peers: Peer[] }>) => {
      const { peers } = action.payload;

      peers.forEach((peer) => {
        state[peer.id] = peer;
      });
    },

    removeRequestPeer: (state, action: PayloadAction<{ peerId: string }>) => {
      delete state[action.payload.peerId];
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
