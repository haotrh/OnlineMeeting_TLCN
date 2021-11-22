import { MediaKind } from "mediasoup-client/lib/RtpParameters";

export type SpotlightType = "peer" | "screen";

export type ConsumerType = "mic" | "webcam" | "screen";

export type PinType = "myview" | "myscreen" | "otherpeer" | null;

export interface Spotlight {
  type: SpotlightType;
  peerId: string;
}

export type RoomPermission =
  | "SHARE_AUDIO"
  | "SHARE_VIDEO"
  | "SHARE_SCREEN"
  | "SEND_CHAT";

export interface ConsumerState {
  id: string;
  peerId: string;
  kind: MediaKind;
  locallyPaused: boolean;
  remotelyPaused: boolean;
  source: string;
  track: MediaStreamTrack;
  score: number;
}

export interface Peer {
  name: string;
  email: string;
  picture: string;
  id: string;
  authId: string;
  isHost: boolean;
  raisedHand: boolean;
  micConsumer?: string;
  webcamConsumer?: string;
  screenConsumer?: string;
  isSpeaking?: boolean;
}

export interface Room {
  name?: string;
  id?: string;
  allowCamera?: boolean;
  allowChat?: boolean;
  allowMicrophone?: boolean;
  allowScreenShare?: boolean;
  allowToJoin?: boolean;
  isHost?: boolean;
}

export interface CreateRoom {
  name: string;
}
