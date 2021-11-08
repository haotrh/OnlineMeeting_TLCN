import { useContext, useEffect, useRef } from "react";
import { Peer } from "../../../../../types/room.type";
import { RoomContext } from "../../../../contexts/RoomContext";

export const ScreenItem = ({ peer }: { peer: Peer }) => {
  const { consumers } = useContext(RoomContext);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    consumers.forEach((consumer) => {
      if (consumer.appData.source === "mic") {
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        audioRef.current.srcObject = stream;
      }
      if (consumer.appData.source === "webcam") {
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <div className="bg-[#3C4043] flex-center rounded-lg relative select-none h-full w-[400px]">
      <div className="w-24 h-24">
        <img
          src={peer.picture}
          className="w-full h-full rounded-full"
          alt="avatar"
        />
      </div>
      <div className="absolute left-0 bottom-0 py-2 px-4 text-[17px] text-gray-300 font-semibold">
        {peer.name}
      </div>
      <video ref={videoRef} playsInline={false} autoPlay={true} />
      <div aria-hidden="true" tabIndex={-1}>
        <video
          className="hidden"
          ref={audioRef}
          playsInline={false}
          autoPlay={true}
        />
      </div>
    </div>
  );
};
