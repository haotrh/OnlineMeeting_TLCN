import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PinType, Room, Spotlight } from "../../../types/room.type";

type RoomStateType =
  | "new"
  | "connecting"
  | "connected"
  | "disconnected"
  | "closed"
  | "denied"
  | "requesting";

interface RoomState extends Room {
  state: RoomStateType;
  inRoom: boolean;
  activeSpeaker: string | null;
  spotlights: Spotlight[];
  pin: PinType;
}

const initialState: RoomState = {
  state: "new",
  inRoom: false,
  pin: null,
  activeSpeaker: null,
  spotlights: [],
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomInfo: (state, action: PayloadAction<{ roomInfo: Room }>) => {
      const { roomInfo } = action.payload;

      state = { ...state, ...roomInfo };
      return state;
    },

    setRoomState: (state, action: PayloadAction<RoomStateType>) => {
      state.state = action.payload;
    },

    setSpotlights: (state, action: PayloadAction<Spotlight[]>) => {
      state.spotlights = action.payload;
    },

    setPin: (state, action: PayloadAction<PinType>) => {
      state.pin = action.payload;
    },

    setInRoom: (state, action: PayloadAction<boolean>) => {
      state.inRoom = action.payload;
    },

    setActiveSpeaker: (state, action: PayloadAction<string | null>) => {
      state.activeSpeaker = action.payload;
    },

    clearRoom: () => {
      return initialState;
    },
  },
});

export const {
  clearRoom,
  setRoomInfo,
  setActiveSpeaker,
  setInRoom,
  setRoomState,
  setSpotlights,
  setPin,
} = roomSlice.actions;

export default roomSlice.reducer;
