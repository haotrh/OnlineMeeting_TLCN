import axios from "axios";
import _ from "lodash";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { RoomContext, RoomState } from "../../components/contexts/RoomContext";
import JoinedRoom from "../../components/pages/MeetingRoom/JoinedRoom/JoinedRoom";
import Lobby from "../../components/pages/MeetingRoom/Lobby/Lobby";
import { Peer, Room } from "../../types/room.type";
import { RequestMethod, RoomSocket } from "../../types/socket.type";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  const room = (
    await axios.get(`http://localhost:3001/api/rooms/${context.query.roomId}`)
  ).data;

  return { props: { room, token: session.accessToken } };
};

const MeetingRoomPage: NextPage = ({ room, token }: any) => {
  const [roomState, setRoomState] = useState<RoomState>(
    !room ? "NOT_FOUND" : "LOADING"
  );
  const [roomInfo, setRoomInfo] = useState<Room>({} as Room);
  const [enableMic, setEnableMic] = useState(true);
  const [enableCamera, setEnableCamera] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [requestPeers, setRequestPeers] = useState<Peer[] | null>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [micProducer, setMicProducer] = useState<Producer>({} as Producer);
  const [webcamProducer, setWebcamProducer] = useState<Producer>(
    {} as Producer
  );
  const [mediasoupDevice, setMediasoupDevice] = useState<Device>({} as Device);
  const [sendTransport, setSendTransport] = useState<Transport>(
    {} as Transport
  );
  const [recvTransport, setRecvTransport] = useState<Transport>(
    {} as Transport
  );
  const [isSharingScreen, setSharingScreen] = useState(false);
  const [socket, setSocket] = useState<RoomSocket>({} as RoomSocket);

  useEffect(() => {
    const socket = io("http://localhost:3001/", {
      withCredentials: true,
      query: {
        roomId: room.id,
        token,
      },
    }) as RoomSocket;

    socket.request = (method: RequestMethod, data = {}) => {
      return new Promise((resolve, reject) => {
        socket.emit("request", { method, data }, (returnedData: any) => {
          if (returnedData && returnedData.error) {
            reject(returnedData.error);
          } else {
            resolve(returnedData);
          }
        });
      });
    };

    setSocket(socket);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("init", () => {
      socket.request("getMyRoomInfo").then((data) => {
        const { peers, requestPeers, ...roomInfo } = data;
        setRoomInfo(roomInfo);
        setPeers(peers);
        setRequestPeers(requestPeers);
      });

      setRoomState("LOBBY");
    });

    socket.on("disconnect", () => {
      console.log("Socket connected");
      setRoomState("NOT_FOUND");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(socket)) {
      socket.on("request", async (request, cb) => {
        switch (request.method) {
          case "newConsumer": {
            console.log("newconsumer");
            const {
              peerId,
              producerId,
              id,
              kind,
              rtpParameters,
              appData,
              producerPaused,
            } = request.data;

            const consumer = await recvTransport.consume({
              id,
              producerId,
              kind,
              rtpParameters,
              appData: { ...appData, peerId },
            });

            setConsumers([...consumers, consumer]);

            consumer.on("transportclose", () => {
              setConsumers(consumers.filter((consumer) => consumer.id !== id));
            });

            cb(null);

            break;
          }
          default:
            console.log("unknown request method");
        }
      });

      socket.on("notification", async (notification) => {
        switch (notification.method) {
          case "consumerClosed": {
            const { consumerId } = notification.data;
            const consumer = consumers.find(
              (consumer) => consumer.id === consumerId
            );

            if (!consumer) break;

            consumer.close();

            setConsumers(
              consumers.filter((consumer) => consumer.id !== consumerId)
            );

            break;
          }
          case "consumerResumed": {
            const { consumerId } = notification.data;
            const consumer = consumers.find(
              (consumer) => consumer.id === consumerId
            );

            if (!consumer) break;

            consumer.resume();

            break;
          }
          case "consumerPaused": {
            const { consumerId } = notification.data;
            const consumer = consumers.find(
              (consumer) => consumer.id === consumerId
            );

            if (!consumer) break;

            consumer.pause();

            break;
          }
          default:
            console.log("unknown notification method", {
              method: notification.method,
            });
        }
      });

      return () => {
        socket.off("request");
        socket.off("notification");
      };
    }
  }, [consumers, recvTransport, room.id, token, socket]);

  return (
    <RoomContext.Provider
      value={{
        roomState,
        setRoomState,
        roomInfo,
        setRoomInfo,
        enableCamera,
        enableMic,
        isSharingScreen,
        setEnableMic,
        setSharingScreen,
        setEnableCamera,
        recvTransport,
        sendTransport,
        setRecvTransport,
        setSendTransport,
        mediasoupDevice,
        setMediasoupDevice,
        peers,
        setPeers,
        requestPeers,
        setRequestPeers,
        roomId: room.id,
        socket,
        consumers,
        micProducer,
        setConsumers,
        setMicProducer,
        setWebcamProducer,
        webcamProducer,
      }}
    >
      {roomState === "LOADING" && <div>Loading</div>}
      {roomState === "NOT_FOUND" && <div>Not found</div>}
      {roomState === "LOBBY" && <Lobby />}
      {roomState === "JOINED" && <JoinedRoom />}
    </RoomContext.Provider>
  );
};

export default MeetingRoomPage;
