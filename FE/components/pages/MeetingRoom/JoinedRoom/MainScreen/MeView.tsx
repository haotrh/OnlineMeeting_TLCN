import classNames from "classnames";
import { motion, TargetAndTransition } from "framer-motion";
import { useContext } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { RoomContext } from "../../../../contexts/RoomContext";
import { VideoView } from "./VideoView";

export const MeView = ({ style }: { style: TargetAndTransition }) => {
  const pin = useAppSelector((selector) => selector.room.pin);

  const peer = useAppSelector((selector) => selector.me.info);

  const { webcamProducer } = useContext(RoomContext);

  return (
    <>
      <motion.div
        animate={style}
        transition={{ type: "keyframes", ease: "linear", duration: 0.02 }}
        className={classNames(
          "bg-[#3C4043] flex-center rounded-lg relative select-none overflow-hidden m-1",
          { "order-[-1]": pin === "myview" }
        )}
      >
        <div className="w-24 h-24">
          <img
            src={peer.picture}
            className="w-full h-full rounded-full"
            alt="avatar"
          />
        </div>
        <div className="absolute z-50 left-0 bottom-0 py-2 px-4 text-[16px] text-gray-300 font-bold">
          You
        </div>
        {webcamProducer && <VideoView track={webcamProducer?.track} />}
      </motion.div>
    </>
  );
};
