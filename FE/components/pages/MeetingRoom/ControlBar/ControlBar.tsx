import { BsFillVolumeDownFill } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { RiLayoutMasonryFill, RiPhoneFill } from "react-icons/ri";
import { MdFullscreen, MdMoreHoriz } from "react-icons/md";
import ControlButton from "./ControlButton";
import React, { useState } from "react";
import { useSingleton } from "@tippyjs/react";
import Tooltip from "../../../common/Tooltip/Tooltip";
import Popover from "../../../common/Popover/Popover";

const ControlBar = ({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) => {
  const [source, target] = useSingleton();

  const [videoToggling, setVideoToggling] = useState<boolean>(false);
  const [showOption, setShowOption] = useState<boolean>(false);

  const handleCameraToggle = async (on: boolean) => {
    if (videoToggling) {
      return;
    }
    setVideoToggling(true);
    if (on) {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
      });
      let video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.play();
      }
    } else {
      let video = videoRef.current;
      if (video) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
        video.srcObject = null;
      }
    }
    setVideoToggling(false);
  };

  return (
    <>
      <Tooltip singleton={source} />
      <div className="h-[60px] bg-[#EEF2F8] rounded-2xl mt-3 flex-center space-x-3">
        <ControlButton
          tooltip={{ content: "Volume", singleton: target }}
          render={() => <BsFillVolumeDownFill size={24} />}
          disableToggle={true}
        />
        <ControlButton
          tooltip={{ content: "Camera", singleton: target }}
          render={(on) => (on ? <IoVideocam /> : <IoVideocamOff />)}
          preventToggle={videoToggling}
          onClick={handleCameraToggle}
          defaultState={false}
        />
        <ControlButton
          tooltip={{ content: "Microphone", singleton: target }}
          render={(on) => (on ? <FaMicrophone /> : <FaMicrophoneSlash />)}
          defaultState={true}
        />
        <Tooltip content="Leave the room" singleton={target}>
          <button className="bg-red-500 text-white flex-center rounded-full text-xl p-3">
            <RiPhoneFill />
          </button>
        </Tooltip>
        <ControlButton
          tooltip={{ content: "Fullscreen", singleton: target }}
          render={() => <MdFullscreen size={23} />}
          disableToggle={true}
        />
        <ControlButton
          tooltip={{ content: "Change layout", singleton: target }}
          render={() => <RiLayoutMasonryFill size={20} />}
          disableToggle={true}
        />
        <Popover
          interactive={true}
          visible={showOption}
          onClickOutside={() => setShowOption(false)}
          placement="top-start"
          offset={[3, 7]}
          content={
            <div className="py-2 text-[15px] font-medium min-w-[200px]">
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
    </>
  );
};

export default ControlBar;
