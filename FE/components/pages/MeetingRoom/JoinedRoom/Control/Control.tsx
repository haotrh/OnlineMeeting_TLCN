import { useSingleton } from "@tippyjs/react";
import React, { useContext } from "react";
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
          tooltip={{ content: "Camera", singleton: target }}
          preventClick={webcamInProgress}
        >
          {!videoMuted ? <IoVideocam /> : <IoVideocamOff />}
        </ControlButton>
        <ControlButton
          onClick={() => {
            if (audioMuted) unmuteMic();
            else muteMic();
          }}
          on={!audioMuted}
          tooltip={{ content: "Microphone", singleton: target }}
          preventClick={audioInProgress}
        >
          {!audioMuted ? <IoMic /> : <IoMicOff />}
        </ControlButton>
        <ControlButton
          onClick={onRaiseHand}
          on={raisedHand}
          tooltip={{ content: "Raise hand", singleton: target }}
        >
          {raisedHand ? <IoHandLeftSharp /> : <IoHandLeftOutline />}
        </ControlButton>
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
        <ControlButton
          onClick={() => {
            if (!isScreenSharing) updateScreenSharing({ start: true });
            else disableScreenSharing();
          }}
          on={isScreenSharing}
          preventClick={screenShareInProgress}
          tooltip={{ content: "Screen share", singleton: target }}
        >
          <MdStopScreenShare size={20} />
        </ControlButton>
        <SettingsButton />
      </div>
    </div>
  );
};

export default Control;
