import classNames from "classnames";
import { motion, MotionStyle, TargetAndTransition } from "framer-motion";
import React, { useContext, useMemo } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { SpotlightType } from "../../../../../types/room.type";
import { RoomContext } from "../../../../contexts/RoomContext";
import ScreenView from "./ScreenView";

const PeerView = ({
  peerId,
  style,
  type,
  isPinned,
}: {
  peerId: string;
  style: MotionStyle;
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
    <ScreenView
      isScreen={type === "screen"}
      peer={peer}
      track={consumer?.track}
      style={style}
      isPinned={isPinned}
    />
  );
};

export const MemorizedPeerView = React.memo(PeerView);
