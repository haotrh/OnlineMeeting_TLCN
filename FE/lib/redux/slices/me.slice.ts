import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Peer } from "../../../types/room.type";

interface DevicesState {
  label: string;
  deviceId: string;
}

export interface MeState {
  info: Peer;
  canSendMic: boolean;
  canSendWebcam: boolean;
  canShareScreen: boolean;
  cameraInProgress: boolean;
  audioInProgress: boolean;
  screenShareInProgress: boolean;
  audioDevices: DevicesState[];
  cameras: DevicesState[];
}

const initialState: MeState = {
  info: {} as Peer,
  canSendMic: false,
  canSendWebcam: false,
  canShareScreen: false,
  cameraInProgress: false,
  audioInProgress: false,
  screenShareInProgress: false,
  audioDevices: [],
  cameras: [],
};

export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    setMediaCapablities: (
      state,
      action: PayloadAction<{
        canSendMic: boolean;
        canSendWebcam: boolean;
        canShareScreen: boolean;
      }>
    ) => {
      const { canSendMic, canSendWebcam, canShareScreen } = action.payload;

      state = { ...state, canSendMic, canSendWebcam, canShareScreen };

      return state;
    },

    setAudioInProgress: (state, action: PayloadAction<{ flag: boolean }>) => {
      const { flag } = action.payload;

      state.audioInProgress = flag;
    },

    setWebcamInProgress: (state, action: PayloadAction<{ flag: boolean }>) => {
      const { flag } = action.payload;

      state.cameraInProgress = flag;
    },

    setScreenShareInProgress: (
      state,
      action: PayloadAction<{ flag: boolean }>
    ) => {
      const { flag } = action.payload;

      state.screenShareInProgress = flag;
    },

    setInfo: (state, action: PayloadAction<Peer>) => {
      state.info = action.payload;
    },

    setAudioDevices: (state, action: PayloadAction<DevicesState[]>) => {
      state.audioDevices = action.payload;
    },

    setRaiseHand: (state, action: PayloadAction<boolean>) => {
      state.info.raisedHand = action.payload;
    },

    setWebcams: (state, action: PayloadAction<DevicesState[]>) => {
      state.cameras = action.payload;
    },
  },
});

export const {
  setAudioInProgress,
  setMediaCapablities,
  setWebcamInProgress,
  setInfo,
  setAudioDevices,
  setWebcams,
  setRaiseHand,
  setScreenShareInProgress,
} = meSlice.actions;

export default meSlice.reducer;
