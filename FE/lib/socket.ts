import io, { Socket } from "socket.io-client";

type RequestType =
  | "createRoom"
  | "join"
  | "getRouterRtpCapabilities"
  | "createWebRtcTransport"
  | "connectTransport"
  | "produce"
  | "connectTransport"
  | "resume"
  | "consume"
  | "exitRoom"
  | "getMyRoomInfo"
  | "getRoomInfoById";

interface RoomSocket extends Socket {
  request: (type: RequestType, data?: any) => Promise<any>;
}

const socket: RoomSocket = io("http://localhost:3001/", {
  withCredentials: true,
}) as RoomSocket;

socket.request = (type: RequestType, data = {}) => {
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
