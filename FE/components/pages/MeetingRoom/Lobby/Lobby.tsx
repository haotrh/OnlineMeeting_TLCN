import { useSession } from "next-auth/react";
import { useContext } from "react";
import { socket } from "../../../../lib/socket";
import { RoomContext } from "../../../contexts/RoomContext";

const Lobby = () => {
  const { roomId, setRoomState, setRoomInfo } = useContext(RoomContext);
  const session = useSession();

  const handleJoinRequest = () => {
    if (socket.request) {
      socket
        .request("join", {
          room_id: roomId,
          name: "asdasd",
        })
        .then((data) => {
          setRoomState("JOINED");
          setRoomInfo(data);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between">
        <div>LOGO</div>
        <div className="">
          {session?.data?.user?.name} {"&"} {session?.data?.user?.email}
        </div>
      </div>
      <div className="flex-grow">
        <div className="min-h-full flex">
          <div className="flex-center flex-grow space-x-12">
            <div className="w-[600px] flex-center">
              <div className="bg-black flex-grow h-[400px]"></div>
            </div>
            <div className="w-[300px] flex-center flex-col">
              <div>San sang tham gia?</div>
              <div>
                <button
                  onClick={handleJoinRequest}
                  className="bg-blue-400 text-white p-3"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
