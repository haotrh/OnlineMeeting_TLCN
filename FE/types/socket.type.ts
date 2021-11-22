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
  | "raiseHand"
  | "getMyRoomInfo"
  | "acceptPeer"
  | "promoteAllPeers"
  | "denyPeer"
  | "denyAllPeers"
  | "chatMessage"
  | "lowerHand"
  | "host:mute"
  | "host:stopVideo"
  | "host:stopScreenSharing"
  | "host:lowerHand"
  | "host:kick"
  | "host:turnOnScreenSharing"
  | "host:turnOffScreenSharing"
  | "host:turnOnChat"
  | "host:turnOffChat"
  | "host:turnOnMicrophone"
  | "host:turnOffMicrophone"
  | "host:turnOnVideo"
  | "host:turnOffVideo";

export interface RoomSocket extends Socket {
  request: (type: RequestMethod, data?: any) => Promise<any>;
}
