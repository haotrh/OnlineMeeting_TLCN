import * as mediasoupClient from "mediasoup-client";
import { createContext } from "react";
import { MediaType } from "../pages/MeetingRoom/JoinedRoom/JoinedRoom";

export interface ConsumeStream {
  consumer: mediasoupClient.types.Consumer;
  stream: MediaStream;
}

interface JoinedRoomContextInterface {
  videoConsumers: ConsumeStream[];
  setVideoConsumers: (consumersStream: ConsumeStream[]) => any;
  audioConsumers: ConsumeStream[];
  setAudioConsumers: (consumersStream: ConsumeStream[]) => any;
  produce: (type: MediaType, deviceId: string) => any;
  device?: mediasoupClient.types.Device;
}

export const JoinedRoomContext = createContext<JoinedRoomContextInterface>(
  {} as JoinedRoomContextInterface
);
