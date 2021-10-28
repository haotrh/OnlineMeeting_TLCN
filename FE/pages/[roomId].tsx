import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import { RoomContext, RoomState } from "../components/contexts/RoomContext";
import JoinedRoom from "../components/pages/MeetingRoom/JoinedRoom/JoinedRoom";
import Lobby from "../components/pages/MeetingRoom/Lobby/Lobby";
import { socket } from "../lib/socket";

const MeetingRoom = () => {
  const { roomId, setRoomInfo, setRoomState, roomState } =
    useContext(RoomContext);

  useEffect(() => {
    if (roomId) {
      socket.on("connect", () => {
        console.log("connected");
      });

      if (socket.request) {
        socket
          .request("getRoomInfoById", { room_id: roomId })
          .then((data) => {
            setRoomState("LOBBY");
            setRoomInfo(data);
          })
          .catch((err) => {
            console.log(err);
            setRoomState("NOT_FOUND");
          });
      }
    }
  }, [roomId, setRoomInfo, setRoomState]);

  if (roomState === "LOADING") return <div>Loading</div>;
  if (roomState === "NOT_FOUND") return <div>Not found</div>;
  if (roomState === "LOBBY") return <Lobby />;
  return <JoinedRoom />;
};

const MeetingRoomPage: NextPage = () => {
  const [roomState, setRoomState] = useState<RoomState>("LOADING");
  const [roomInfo, setRoomInfo] = useState({});

  const router = useRouter();
  const { roomId } = router.query;

  return (
    <RoomContext.Provider
      value={{
        roomState,
        setRoomState,
        roomInfo,
        setRoomInfo,
        roomId: roomId as string,
      }}
    >
      <MeetingRoom />
    </RoomContext.Provider>
  );
};

export default MeetingRoomPage;
