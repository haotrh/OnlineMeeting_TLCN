import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ConsumerType, Peer } from "../../../types/room.type";

export interface PeersState {
  [key: string]: Peer;
}

const initialState: PeersState = {};

export const peersSlice = createSlice({
  name: "peers",
  initialState,
  reducers: {
    addPeer: (state, action: PayloadAction<{ peer: Peer }>) => {
      const { peer } = action.payload;

      state[peer.id] = peer;

      toast(`${peer.name} joined the room`, {
        toastId: `newpeer${peer.id}`,
      });
    },

    addPeers: (state, action: PayloadAction<{ peers: Peer[] }>) => {
      const { peers } = action.payload;

      peers.forEach((peer) => {
        state[peer.id] = peer;
      });
    },

    addPeerConsumer: (
      state,
      action: PayloadAction<{
        consumerId: string;
        peerId: string;
        consumerType: ConsumerType;
      }>
    ) => {
      const { consumerId, peerId, consumerType } = action.payload;

      const peer = state[peerId];

      if (peer) {
        if (consumerType === "mic") {
          peer.micConsumer = consumerId;
        }
        if (consumerType === "screen") {
          peer.screenConsumer = consumerId;
        }
        if (consumerType === "webcam") {
          peer.webcamConsumer = consumerId;
        }

        state[peerId] = peer;
      }
    },

    removePeerConsumer: (
      state,
      action: PayloadAction<{ consumerId: string; peerId: string }>
    ) => {
      const { consumerId, peerId } = action.payload;

      const peer = state[peerId];

      if (peer) {
        if (peer.micConsumer === consumerId) {
          peer.micConsumer = undefined;
        }
        if (peer.screenConsumer === consumerId) {
          peer.screenConsumer = undefined;
        }
        if (peer.webcamConsumer === consumerId) {
          peer.webcamConsumer = undefined;
        }

        state[peerId] = peer;
      }
    },

    removePeer: (state, action: PayloadAction<{ peerId: string }>) => {
      const peer = state[action.payload.peerId];
      if (peer) {
        toast(`${peer.name} left the room`, {
          toastId: `peerleave${peer.id}`,
        });

        delete state[action.payload.peerId];
      }
    },

    setSpeaking: (
      state,
      action: PayloadAction<{ peerId: string; flag: boolean }>
    ) => {
      state[action.payload.peerId].isSpeaking = action.payload.flag;
    },

    setHand: (
      state,
      action: PayloadAction<{ peerId: string; flag: boolean }>
    ) => {
      const { peerId, flag } = action.payload;

      state[peerId].raisedHand = flag;

      if (flag) toast(`${state[peerId].name} has just raised hand`);
    },
  },
});

export const {
  addPeer,
  addPeers,
  removePeer,
  addPeerConsumer,
  removePeerConsumer,
  setHand,
  setSpeaking,
} = peersSlice.actions;

export default peersSlice.reducer;
