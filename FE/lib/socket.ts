import { io } from "socket.io-client";
import { RequestMethod, RoomSocket } from "../types/socket.type";
import { config } from "../utils/config";

const socket: RoomSocket = io(config.backendUrl, {
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
