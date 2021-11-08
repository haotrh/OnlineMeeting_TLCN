import { useContext } from "react";
import { RoomContext } from "../../../../contexts/RoomContext";
import { ScreenItem } from "./ScreenItem";

export const MainScreen = () => {
  const { peers } = useContext(RoomContext);

  return (
    <div className="flex flex-col flex-auto relative w-full py-2">
      <div className="flex-grow relative">
        <div className="absolute inset-0">
          <div className="w-full h-full flex justify-center">
            {/* <video className="w-full h-full object-contain" ref={videoRef} /> */}
            {peers.map((peer) => (
              <ScreenItem peer={peer} key={`screenItem${peer.id}`} />
            ))}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
