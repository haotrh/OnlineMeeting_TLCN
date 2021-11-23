import { MotionStyle, TargetAndTransition } from "framer-motion";
import { useContext } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { RoomContext } from "../../../../contexts/RoomContext";
import ScreenView from "./ScreenView";

export const MeView = ({ style }: { style: MotionStyle }) => {
  const peer = useAppSelector((selector) => selector.me.info);
  const { webcamProducer } = useContext(RoomContext);
  const pin = useAppSelector((selector) => selector.room.pin);
  return (
    <ScreenView
      isScreen={false}
      isPinned={pin === "myview"}
      peer={peer}
      track={webcamProducer?.track}
      style={style}
      isMe={true}
    />
  );
};
