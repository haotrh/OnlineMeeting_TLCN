import { MediaKind } from "mediasoup-client/lib/RtpParameters";
import { User } from "./user.type";

export type SpotlightType = "peer" | "screen";

export type ConsumerType = "mic" | "camera" | "screen";

export type PinType = "myview" | "myscreen" | "otherpeer" | null;

export interface QuestionReply {
  answer: string;
  timestamp: number;
}

export interface PollOption {
  option: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  timestamp: number;
  options: PollOption[];
  voted: number | undefined;
  isClosed: boolean;
}

export interface Question {
  id: string;
  question: string;
  timestamp: number;
  reply: QuestionReply;
  upvotes: number;
  user: {
    displayName: string;
    profilePic: string;
    id: string;
  };
  isClosed: boolean;
  isVoted: boolean;
}

export interface Spotlight {
  type: SpotlightType;
  peerId: string;
}

export type RoomPermission = "SHARE_AUDIO" | "SHARE_VIDEO" | "SHARE_SCREEN";

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
  authId: number;
  isHost: boolean;
  raisedHand: boolean;
  micConsumer?: string;
  cameraConsumer?: string;
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
  allowQuestion?: boolean;
  allowRaiseHand?: boolean;
  allowToJoin?: boolean;
  isPrivate?: boolean;
  isHost?: boolean;
}

export interface RoomData {
  name: string;
  id: string;
  allowCamera: boolean;
  allowChat: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  allowQuestion: boolean;
  allowRaiseHand: boolean;
  allowToJoin: boolean;
  isPrivate: boolean;
  guests: User[];
  createdAt: Date;
  updatedAt: Date;
  host: User;
  hostId: string;
}

export interface CreateRoom {
  name: string;
  allowCamera: boolean;
  allowChat: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  allowQuestion: boolean;
  allowRaiseHand: boolean;
  isPrivate: boolean;
  guests: string[];
}
