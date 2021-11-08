import { BsFillVolumeDownFill } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { RiLayoutMasonryFill, RiPhoneFill } from "react-icons/ri";
import { MdFullscreen, MdMoreHoriz } from "react-icons/md";
import ControlButton from "./ControlButton";
import React, { useContext, useState } from "react";
import { useSingleton } from "@tippyjs/react";
import { motion, Variant, Variants } from "framer-motion";
import Tooltip from "../../../../common/Tooltip/Tooltip";
import Popover from "../../../../common/Popover/Popover";
import { JoinedRoomContext } from "../../../../contexts/JoinedRoomContext";
import { MediaType } from "../JoinedRoom";

const Control = ({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) => {
  const [source, target] = useSingleton();
  const { device } = useContext(JoinedRoomContext);

  const [videoToggling, setVideoToggling] = useState<boolean>(false);
  const [showOption, setShowOption] = useState<boolean>(false);
  const [isShown, setIsShowned] = useState<boolean>(false);

  const onControlClick = async (type: MediaType) => {
    if (type === "audio") {
      const devices = await navigator.mediaDevices.enumerateDevices();
      let deviceId = "";
      devices.forEach((device) => {
        if (device.kind === "audioinput") {
          deviceId = device.deviceId;
        }
      });
    }

    if (type === "video") {
      const devices = await navigator.mediaDevices.enumerateDevices();
      let deviceId = "";
      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          deviceId = device.deviceId;
        }
      });
    }
  };

  return (
    <div className="mt-3">
      <Tooltip singleton={source} />
      <div className="flex justify-between items-center">
        <ControlButton
          tooltip={{ content: "Volume", singleton: target }}
          render={() => <BsFillVolumeDownFill size={24} />}
          disableToggle={true}
        />
        <div className="flex space-x-3 items-center">
          <ControlButton
            tooltip={{ content: "Camera", singleton: target }}
            render={(on) => (on ? <IoVideocam /> : <IoVideocamOff />)}
            preventToggle={videoToggling}
            onClick={() => onControlClick("video")}
            defaultState={false}
          />
          <ControlButton
            onClick={() => onControlClick("audio")}
            tooltip={{ content: "Microphone", singleton: target }}
            render={(on) => (on ? <FaMicrophone /> : <FaMicrophoneSlash />)}
            defaultState={false}
          />
          <Tooltip content="Leave the room" singleton={target}>
            <button className="bg-red-500 text-white flex-center rounded-full text-xl p-3">
              <RiPhoneFill />
            </button>
          </Tooltip>
          <ControlButton
            onClick={() => onControlClick("screen")}
            tooltip={{ content: "Fullscreen", singleton: target }}
            render={() => <MdFullscreen size={23} />}
            disableToggle={true}
          />
          <ControlButton
            tooltip={{ content: "Change layout", singleton: target }}
            render={() => <RiLayoutMasonryFill size={20} />}
            disableToggle={true}
          />
        </div>
        <Popover
          interactive={true}
          visible={showOption}
          onClickOutside={() => setShowOption(false)}
          placement="bottom-end"
          className="!origin-bottom-right"
          offset={[-5, 7]}
          content={
            <div
              onClick={() => setShowOption(false)}
              className="py-2 text-[15px] font-medium min-w-[200px] bg-white text-black"
            >
              <div className="px-3 py-1 block hover:bg-gray-200 cursor-pointer">
                Testing
              </div>
              <div className="px-3 py-1 block hover:bg-gray-200 cursor-pointer">
                Testing
              </div>
              <div className="px-3 py-1 block hover:bg-gray-200 cursor-pointer">
                Testing
              </div>
              <div className="px-3 py-1 block hover:bg-gray-200 cursor-pointer">
                Testing
              </div>
              <div className="px-3 py-1 block hover:bg-gray-200 cursor-pointer">
                Testing
              </div>
            </div>
          }
        >
          <div>
            <ControlButton
              onClick={() => setShowOption(!showOption)}
              tooltip={{ content: "More options", singleton: target }}
              render={() => <MdMoreHoriz size={23} />}
              disableToggle={true}
            />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Control;
