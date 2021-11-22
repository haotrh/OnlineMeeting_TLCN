import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationPlacement = "top" | "bottom-left" | "bottom-right";

export interface Notification {
  top?: string;
  "bottom-left"?: string;
  "bottom-right"?: string;
}

const initialState: Notification = {};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        placement: NotificationPlacement;
        message: string;
      }>
    ) => {
      const { placement, message } = action.payload;

      state[placement] = message;
    },

    removeNotification: (
      state,
      action: PayloadAction<{ placement: NotificationPlacement }>
    ) => {
      delete state[action.payload.placement];
    },

    clearNotification: () => {
      return {};
    },
  },
});

export const { addNotification, clearNotification, removeNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
