import type { NextPage } from "next";
import RightContainer from "../components/pages/MeetingRoom/RightContainer/RightContainer";
import { useRef, useState } from "react";
import ControlBar from "../components/pages/MeetingRoom/ControlBar/ControlBar";

const MeetingRoomPage: NextPage = () => {
  const videoRef = useRef<null | HTMLVideoElement>(null);

  return (
    <div className="w-screen h-screen flex p-3 space-x-4">
      <div className="flex-1 flex-col flex">
        <div className="flex-1 flex flex-col flex-wrap">
          <div className="flex-1 rounded-2xl overflow-hidden bg-gray-600">
            <video className="w-full h-full object-contain" ref={videoRef} />
          </div>
        </div>
        <ControlBar videoRef={videoRef} />
      </div>
      <RightContainer />
    </div>
  );
};

export default MeetingRoomPage;
