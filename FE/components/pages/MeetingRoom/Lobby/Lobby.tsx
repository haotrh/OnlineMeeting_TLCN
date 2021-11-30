import classNames from "classnames";
import _ from "lodash";
import { Device } from "mediasoup-client";
import { useContext, useEffect, useRef, useState } from "react";
import { IoMic, IoMicOff, IoVideocam, IoVideocamOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { PageLayout } from "../../../../layouts/PageLayout";
import {
  setAudioMuted,
  setVideoMuted,
} from "../../../../lib/redux/slices/settings.slice";
import Button from "../../../common/Button/Button";
import { RoomContext } from "../../../contexts/RoomContext";
import CircularLoading from "../../../global/Loading/CircularLoading";
import { ThreeDotsLoading } from "../../../global/Loading/ThreeDotsLoading";

export type LobbyState = "NORMAL" | "WAIT" | "REJECT";

const Lobby = () => {
  const { handleJoinRoom } = useContext(RoomContext);

  const { audioMuted, videoMuted } = useAppSelector(
    (selector) => selector.settings
  );

  const roomState = useAppSelector((selector) => selector.room.state);
  const roomInfo = useAppSelector((selector) => selector.room);

  console.log(roomInfo);

  const dispatch = useAppDispatch();

  return (
    <PageLayout noFooter>
      <div className="h-screen flex flex-col absolute top-0 inset-0">
        <div className="flex-grow">
          <div className="min-h-full flex">
            <div className="flex-center flex-grow space-x-12">
              <div className="flex-center max-w-[764px] m-2 flex-1 relative select-none">
                <div
                  className="bg-[#202124] text-2xl text-gray-50 flex-center
                shadow-inner flex-grow h-[400px] rounded-xl flex-center relative overflow-hidden"
                >
                  Camera is off
                </div>
                <div className="absolute bottom-0 left-0 w-full flex-center p-4 space-x-3">
                  <button
                    onClick={() => dispatch(setAudioMuted(!audioMuted))}
                    className={classNames(
                      "rounded-full w-12 h-12 flex-center text-xl text-white transition-colors",
                      {
                        "bg-gray-700/40 backdrop-blur hover:bg-gray-600/40":
                          !audioMuted,
                        "bg-red-600 hover:bg-red-500": audioMuted,
                      }
                    )}
                  >
                    {!audioMuted ? <IoMic /> : <IoMicOff />}
                  </button>
                  <button
                    onClick={() => dispatch(setVideoMuted(!videoMuted))}
                    className={classNames(
                      "rounded-full w-12 h-12 flex-center text-xl text-white transition-colors",
                      {
                        "bg-gray-700/40 backdrop-blur hover:bg-gray-600/40":
                          !videoMuted,
                        "bg-red-600 hover:bg-red-500": videoMuted,
                      }
                    )}
                  >
                    {!videoMuted ? <IoVideocam /> : <IoVideocamOff />}
                  </button>
                </div>
              </div>
              <div className="w-[448px] flex-center flex-col select-none font-medium">
                {roomState === "connecting" && (
                  <>
                    <h2 className="text-[28px] mb-3">Getting ready...</h2>
                    <div>You&apos;ll able to join in just a moment</div>
                    <div className="flex-center mt-4">
                      <CircularLoading size={36} />
                    </div>
                  </>
                )}
                {roomState === "connected" && (
                  <>
                    <h2 className="text-[28px] mb-4">Ready to join?</h2>
                    <div className="mt-3">
                      <Button
                        className="w-[120px] rounded-full !py-3 font-medium font-poppins"
                        onClick={handleJoinRoom}
                      >
                        {roomInfo.allowToJoin ? "Join now" : "Ask to join"}
                      </Button>
                    </div>
                  </>
                )}
                {roomState === "requesting" && (
                  <>
                    <h2 className="text-[28px] mb-4">Asking to join...</h2>
                    <div>
                      You&apos;ll join the call when someone lets you in
                    </div>
                    <div className="mt-5">
                      <ThreeDotsLoading />
                    </div>
                  </>
                )}
                {roomState === "denied" && (
                  <>
                    <h2 className="text-[28px] mb-4">
                      You can&apos;t join this call
                    </h2>
                    <div>Meeting host denied your request to join</div>
                  </>
                )}
                {roomState === "closed" && (
                  <>
                    <h2 className="text-[28px] mb-4">
                      The room has been closed
                    </h2>
                    <div className="text-center">
                      Host has just closed the room, refresh the page to create
                      new session
                    </div>
                  </>
                )}
                {roomState === "disconnected" && (
                  <>
                    <h2 className="text-[28px] mb-4">
                      You have been disconnected
                    </h2>
                    <div>Check your internet and reload the page</div>
                  </>
                )}
                {roomState === "server disconnect" && (
                  <>
                    <h2 className="text-[28px] mb-4">The room is private</h2>
                    <div>You are not valid to join the room</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Lobby;
