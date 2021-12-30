import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Peer, PinType, Room, Spotlight } from "../../../types/room.type";

export type RoomStateType =
  //When initializing connection with socket or after join room and init data
  | "connecting"
  //After "loading" in Lobby or "connecting" in Room
  | "connected"
  | "disconnected"
  | "server disconnect"
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
  privateMessage: string;
  allValidPeers: Peer[];
}

const initialState: RoomState = {
  state: "connecting",
  inRoom: false,
  pin: null,
  activeSpeaker: null,
  spotlights: [],
  privateMessage: "",
  allValidPeers: [],
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

    setRoomName: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      state.name = name;
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

    setRoomPrivate: (state, action: PayloadAction<boolean>) => {
      state.isPrivate = action.payload;
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

    setPrivateMessage: (state, action: PayloadAction<string>) => {
      state.privateMessage = action.payload;
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
  setRoomName,
  setRoomAllowCamera,
  setRoomAllowChat,
  setRoomAllowMicrophone,
  setRoomAllowScreenshare,
  setRoomAllowQuestion,
  setRoomAllowRaiseHand,
  setRoomPrivate,
  setPrivateMessage,
} = roomSlice.actions;

export default roomSlice.reducer;
