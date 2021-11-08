import { Socket } from "socket.io-client";

export type RequestMethod =
  | "getRouterRtpCapabilities"
  | "join"
  | "askToJoin"
  | "acceptPeer"
  | "acceptAllPeers"
  | "createWebRtcTransport"
  | "connectWebRtcTransport"
  | "restartIce"
  | "produce"
  | "closeProducer"
  | "pauseProducer"
  | "resumeProducer"
  | "pauseConsumer"
  | "resumeConsumer"
  | "chatMessage"
  | "raisedHand"
  | "getMyRoomInfo"
  | "acceptPeer"
  | "promoteAllPeers"
  | "denyPeer"
  | "denyAllPeers";

export interface RoomSocket extends Socket {
  request: (type: RequestMethod, data?: any) => Promise<any>;
}
