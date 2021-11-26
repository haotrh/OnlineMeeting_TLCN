import classNames from "classnames";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { useAppSelector } from "../../../../hooks/redux";
import Button from "../../../common/Button/Button";
import { ThreeDotsLoading } from "../../../global/Loading/ThreeDotsLoading";
import { AcceptPeerModal } from "./AcceptPeerModal/AcceptPeerModal";
import Control from "./Control/Control";
import { MainScreen } from "./MainScreen/MainScreen";
import { AudioPeers } from "./PeerAudio/AudioPeers";
import RightContainer from "./RightContainer/RightContainer";
import Link from "next/link";
import Logo from "../../../global/Logo/Logo";

export type MediaType = "audio" | "video" | "screen";

const JoinedRoom = () => {
  const roomInfo = useAppSelector((selector) => selector.room);
  const [showRightContainer, setShowRightContainer] = useState<boolean>(true);

  return (
    <div>
      <AcceptPeerModal />
      <AudioPeers />
      <div className="w-screen h-screen flex space-x-4 overflow-hidden font-quicksand bg-[#202124] text-gray-50">
        {roomInfo.state === "connecting" && (
          <div className="w-full h-full flex-center flex-col select-none">
            <div className="mb-4 text-lg font-semibold text-gray-200">
              Loading
            </div>
            <ThreeDotsLoading />
          </div>
        )}
        {roomInfo.state === "connected" && (
          <>
            <motion.div
              animate={showRightContainer ? { width: "100vw" } : {}}
              className="flex-1 flex-col flex p-4 overflow-hidden"
            >
              <div className="h-[40px] mb-2 flex justify-between items-center">
                <div className="flex space-x-3 items-center">
                  <div className="bg-white p-1.5 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                    <Logo size={32} />
                  </div>
                  <div className="font-semibold">{roomInfo.name}</div>
                </div>
                <div>
                  <button
                    className="text-xl hover:bg-gray-50/20 p-2 rounded-full transition-colors"
                    onClick={() => setShowRightContainer(!showRightContainer)}
                  >
                    <BsArrowBarRight
                      className={classNames({
                        "scale-x-[-1]": !showRightContainer,
                      })}
                    />
                  </button>
                </div>
              </div>
              <MainScreen />
              <Control />
            </motion.div>
            <RightContainer show={showRightContainer} />
          </>
        )}
        {roomInfo.state === "closed" && (
          <div className="w-full pt-40 flex items-center flex-col">
            <h1 className="text-2xl text-white font-semibold">
              You left the meeting
            </h1>
            <Link href="/app" passHref>
              <div>
                <Button className="mt-7 font-semibold text-[16px]">
                  Return to home
                </Button>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedRoom;
