import classNames from "classnames";
import {
  AnimationControls,
  motion,
  MotionStyle,
  TargetAndTransition,
} from "framer-motion";
import React, { useContext, useMemo } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { SpotlightType } from "../../../../../types/room.type";
import { RoomContext } from "../../../../contexts/RoomContext";
import { VideoView } from "./VideoView";

const PeerView = ({
  peerId,
  style,
  type,
  isPinned = false,
}: {
  peerId: string;
  style: TargetAndTransition;
  type: SpotlightType;
  isPinned: boolean;
}) => {
  const { consumers } = useContext(RoomContext);

  const peer = useAppSelector((selector) => selector.peers[peerId]);

  const consumer = useMemo(() => {
    if (type === "peer") {
      const webcamConsumer = peer.webcamConsumer
        ? consumers[peer.webcamConsumer]
        : null;

      return webcamConsumer;
    }

    if (type === "screen") {
      const screenConsumer = peer.screenConsumer
        ? consumers[peer.screenConsumer]
        : null;

      return screenConsumer;
    }

    return null;
  }, [peer]);

  return (
    <motion.div
      animate={style}
      transition={{ type: "keyframes", ease: "linear", duration: 0.02 }}
      className={classNames(
        "bg-[#3C4043] flex-center rounded-lg relative select-none overflow-hidden m-1",
        { "order-[-1]": isPinned }
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
        {peer.name}
      </div>
      {consumer && <VideoView track={consumer.track} />}
    </motion.div>
  );
};

export const MemorizedPeerView = React.memo(PeerView);
