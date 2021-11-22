import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { createContext } from "react";
import { PinType, Spotlight } from "../../types/room.type";
import { RoomSocket } from "../../types/socket.type";

export type RoomState = "LOBBY" | "JOINED" | "LOADING" | "DISCONNECT";

interface RoomContextInterface {
  handleJoinRoom: () => any;
  unmuteMic: () => any;
  muteMic: () => any;
  socket: RoomSocket;
  consumers: { [consumerId: string]: Consumer };
  disableWebcam: () => any;
  updateWebcam: (data?: any) => any;
  updateMic: (data?: any) => any;
  changeMaxSpotlights: (maxSpotlights: number) => any;
  addPeerToSpotlight: (peerId: string) => any;
  webcamProducer: Producer | null;
  updateScreenSharing: (data?: any) => any;
  disableScreenSharing: () => any;
  screenProducer: Producer | null;
  pinSpotlight: (spotlight: Spotlight, pinType?: PinType) => any;
  unpinSpotlight: () => any;
  close: () => any;
}

export const RoomContext = createContext<RoomContextInterface>(
  {} as RoomContextInterface
);
