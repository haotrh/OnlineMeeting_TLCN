import { io } from "socket.io-client";
import { RequestMethod, RoomSocket } from "../types/socket.type";

const socket: RoomSocket = io("http://localhost:3001/", {
  withCredentials: true,
}) as RoomSocket;

socket.request = (type: RequestMethod, data = {}) => {
  return new Promise((resolve, reject) => {
    socket.emit(type, data, (data: any) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
    });
  });
};

export { socket };
