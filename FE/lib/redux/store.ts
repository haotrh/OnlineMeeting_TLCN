import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chat.slice";
import meSlice from "./slices/me.slice";
import notificationsSlice from "./slices/notifications.slice";
import peersSlice from "./slices/peers.slice";
import peerVolumesSlice from "./slices/peerVolumes.slice";
import pollsSlice from "./slices/polls.slice";
import questionsSlice from "./slices/questions.slice";
import requestPeersSlice from "./slices/requestPeers.slice";
import roomSlice from "./slices/room.slice";
import settingsSlice from "./slices/settings.slice";

export const store = configureStore({
  reducer: {
    peers: peersSlice,
    requestPeers: requestPeersSlice,
    room: roomSlice,
    me: meSlice,
    settings: settingsSlice,
    notifications: notificationsSlice,
    peerVolumes: peerVolumesSlice,
    chat: chatSlice,
    questions: questionsSlice,
    polls: pollsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
