import { useSingleton } from "@tippyjs/react";
import React, { useContext, useState } from "react";
import {
  IoHandLeftOutline,
  IoHandLeftSharp,
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
} from "react-icons/io5";
import { MdStopScreenShare } from "react-icons/md";
import { RiPhoneFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { setRaiseHand } from "../../../../../lib/redux/slices/me.slice";
import Popover from "../../../../common/Popover/Popover";
import Tooltip from "../../../../common/Tooltip/Tooltip";
import { RoomContext } from "../../../../contexts/RoomContext";
import { SettingsButton } from "../Settings/SettingsButton";
import ControlButton from "./ControlButton";

const Control = () => {
  const {
    muteMic,
    unmuteMic,
    updateWebcam,
    disableWebcam,
    updateScreenSharing,
    disableScreenSharing,
    close,
    socket,
  } = useContext(RoomContext);

  const [source, target] = useSingleton();

  const { videoMuted, audioMuted, isScreenSharing } = useAppSelector(
    (selector) => selector.settings
  );

  const raisedHand = useAppSelector((selector) => selector.me.info.raisedHand);

  const { audioInProgress, webcamInProgress, screenShareInProgress } =
    useAppSelector((selector) => selector.me);

  const room = useAppSelector((selector) => selector.room);

  const [openClose, setOpenClose] = useState(false);

  const dispatch = useAppDispatch();

  const onRaiseHand = async () => {
    try {
      if (!raisedHand) {
        await socket.request("raiseHand");

        dispatch(setRaiseHand(true));
      } else {
        await socket.request("lowerHand");

        dispatch(setRaiseHand(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-3">
      <Tooltip singleton={source} />
      <div className="flex-center space-x-3">
        <ControlButton
          onClick={() => {
            if (!videoMuted) disableWebcam();
            else updateWebcam({ start: true });
          }}
          on={!videoMuted}
          tooltip={{
            content: "Camera",
            singleton: target,
          }}
          preventClick={webcamInProgress || (!room.allowCamera && !room.isHost)}
        >
          {!videoMuted ? <IoVideocam /> : <IoVideocamOff />}
        </ControlButton>
        <ControlButton
          onClick={() => {
            if (audioMuted) unmuteMic();
            else muteMic();
          }}
          on={!audioMuted}
          tooltip={{
            content: "Microphone",
            singleton: target,
          }}
          preventClick={
            audioInProgress || (!room.allowMicrophone && !room.isHost)
          }
        >
          {!audioMuted ? <IoMic /> : <IoMicOff />}
        </ControlButton>
        {room.allowRaiseHand && (
          <ControlButton
            onClick={onRaiseHand}
            on={raisedHand}
            tooltip={{ content: "Raise hand", singleton: target }}
          >
            {raisedHand ? <IoHandLeftSharp /> : <IoHandLeftOutline />}
          </ControlButton>
        )}
        {!room.isHost && (
          <Tooltip content="Leave the room" singleton={target}>
            <button
              onClick={() => {
                close();
              }}
              className="bg-red-500 text-white flex-center rounded-full text-xl p-3"
            >
              <RiPhoneFill />
            </button>
          </Tooltip>
        )}
        {room.isHost && (
          <Popover
            interactive={true}
            placement={"top"}
            visible={openClose}
            onClickOutside={() => setOpenClose(false)}
            content={
              <div className="bg-white text-[15px] shadow-md text-gray-600 py-1 rounded-md flex flex-col w-[200px]">
                <button
                  onClick={close}
                  className="text-left py-1 px-2.5 hover:bg-gray-100 font-semibold"
                >
                  Leave the room
                </button>
                <button
                  onClick={() => socket.request("host:closeRoom")}
                  className="text-left py-1 px-2.5 hover:bg-gray-100 font-semibold"
                >
                  Close the room
                </button>
              </div>
            }
          >
            <button
              onClick={() => setOpenClose(!openClose)}
              className="bg-red-500 text-white flex-center rounded-full text-xl p-3"
            >
              <RiPhoneFill />
            </button>
          </Popover>
        )}
        <ControlButton
          onClick={() => {
            if (!isScreenSharing) updateScreenSharing({ start: true });
            else disableScreenSharing();
          }}
          on={isScreenSharing}
          preventClick={
            screenShareInProgress || (!room.allowScreenShare && !room.isHost)
          }
          tooltip={{
            content: "Screen share",
            singleton: target,
          }}
        >
          <MdStopScreenShare size={20} />
        </ControlButton>
        <SettingsButton />
      </div>
    </div>
  );
};

export default Control;
