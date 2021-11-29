import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PinType, Room, Spotlight } from "../../../types/room.type";

type RoomStateType =
  //When initializing connection with socket or after join room and init data
  | "connecting"
  //After "loading" in Lobby or "connecting" in Room
  | "connected"
  | "disconnected"
  | "closed"
  | "left"
  //Ask to join denied
  | "denied"
  //Ask to join waiting
  | "requesting";

interface RoomState extends Room {
  state: RoomStateType;
  inRoom: boolean;
  activeSpeaker: string | null;
  spotlights: Spotlight[];
  pin: PinType;
}

const initialState: RoomState = {
  state: "connecting",
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

    setRoomAllowChat: (state, action: PayloadAction<boolean>) => {
      state.allowChat = action.payload;
    },

    setRoomAllowCamera: (state, action: PayloadAction<boolean>) => {
      state.allowCamera = action.payload;
    },

    setRoomAllowMicrophone: (state, action: PayloadAction<boolean>) => {
      state.allowMicrophone = action.payload;
    },

    setRoomAllowScreenshare: (state, action: PayloadAction<boolean>) => {
      state.allowScreenShare = action.payload;
    },

    setRoomAllowQuestion: (state, action: PayloadAction<boolean>) => {
      state.allowQuestion = action.payload;
    },

    setRoomAllowRaiseHand: (state, action: PayloadAction<boolean>) => {
      state.allowRaiseHand = action.payload;
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
  setRoomAllowCamera,
  setRoomAllowChat,
  setRoomAllowMicrophone,
  setRoomAllowScreenshare,
  setRoomAllowQuestion,
  setRoomAllowRaiseHand,
} = roomSlice.actions;

export default roomSlice.reducer;
