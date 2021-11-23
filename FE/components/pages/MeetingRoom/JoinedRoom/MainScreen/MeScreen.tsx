import { MotionStyle } from "framer-motion";
import { useContext } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { RoomContext } from "../../../../contexts/RoomContext";
import ScreenView from "./ScreenView";

export const MeScreen = ({ style }: { style: MotionStyle }) => {
  const { screenProducer } = useContext(RoomContext);
  const peer = useAppSelector((selector) => selector.me.info);
  const pin = useAppSelector((selector) => selector.room.pin);
  return (
    <ScreenView
      isScreen={true}
      isPinned={pin === "myscreen"}
      peer={peer}
      track={screenProducer?.track}
      style={style}
      isMe={true}
    />
  );
};
