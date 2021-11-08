import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import { createContext } from "react";
import { Peer, Room } from "../../types/room.type";
import { RoomSocket } from "../../types/socket.type";

export type RoomState = "NOT_FOUND" | "LOBBY" | "JOINED" | "LOADING";

interface RoomContextInterface {
  roomState: RoomState;
  setRoomState: (state: RoomState) => any;
  roomInfo: Room;
  setRoomInfo: (data: Room) => any;
  roomId: string;
  enableMic: boolean;
  setEnableMic: (value: boolean) => any;
  enableCamera: boolean;
  setEnableCamera: (value: boolean) => any;
  isSharingScreen: boolean;
  setSharingScreen: (value: boolean) => any;
  mediasoupDevice: Device;
  setMediasoupDevice: (device: Device) => any;
  sendTransport: Transport;
  setSendTransport: (transport: Transport) => any;
  recvTransport: Transport;
  setRecvTransport: (transport: Transport) => any;
  peers: Peer[];
  setPeers: (peers: Peer[]) => any;
  requestPeers: Peer[] | null;
  setRequestPeers: (peers: Peer[] | null) => any;
  socket: RoomSocket;
  consumers: Consumer[];
  setConsumers: (consumers: Consumer[]) => any;
  micProducer: Producer;
  setMicProducer: (producer: Producer) => any;
  webcamProducer: Producer;
  setWebcamProducer: (producer: Producer) => any;
}

export const RoomContext = createContext<RoomContextInterface>(
  {} as RoomContextInterface
);
