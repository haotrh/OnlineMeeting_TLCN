import { createContext } from "react";

export type RoomState = "NOT_FOUND" | "LOBBY" | "JOINED" | "LOADING";

interface RoomContextInterface {
  roomState: RoomState;
  setRoomState: (state: RoomState) => any;
  roomInfo: any;
  setRoomInfo: (data: any) => any;
  roomId: string;
}

export const RoomContext = createContext<RoomContextInterface>(
  {} as RoomContextInterface
);
