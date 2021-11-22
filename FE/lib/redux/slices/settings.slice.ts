import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  selectedWebcam: string | null;
  selectedAudioDevice: string | null;
  noiseThreshold: number;
  audioMuted: boolean;
  videoMuted: boolean;
  isScreenSharing: boolean;
  // low, medium, high, veryhigh, ultra
  resolution: "low" | "medium" | "high" | "veryhigh" | "ultra";
  frameRate: number;
  screenSharingResolution: "low" | "medium" | "high" | "veryhigh" | "ultra";
  screenSharingFrameRate: number;
  lastN: number;
  aspectRatio: number;
}

const initialState: SettingsState = {
  selectedWebcam: null,
  selectedAudioDevice: null,
  noiseThreshold: -50,
  audioMuted: false,
  videoMuted: false,
  isScreenSharing: false,
  // low, medium, high, veryhigh, ultra
  resolution: "medium",
  frameRate: 30,
  screenSharingResolution: "veryhigh",
  screenSharingFrameRate: 15,
  lastN: 12,
  aspectRatio: 1.777, // 16 : 9
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeWebcam: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload;

      state.selectedWebcam = deviceId;
    },

    changeAudioDevice: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload;

      state.selectedAudioDevice = deviceId;
    },

    setAudioMuted: (state, action: PayloadAction<boolean>) => {
      state.audioMuted = action.payload;
    },

    setVideoMuted: (state, action: PayloadAction<boolean>) => {
      state.videoMuted = action.payload;
    },

    setIsScreenSharing: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharing = action.payload;
    },

    setLastN: (state, action: PayloadAction<number>) => {
      state.lastN = action.payload;
    },
  },
});

export const {
  changeAudioDevice,
  changeWebcam,
  setAudioMuted,
  setVideoMuted,
  setLastN,
  setIsScreenSharing,
} = settingsSlice.actions;

export default settingsSlice.reducer;
