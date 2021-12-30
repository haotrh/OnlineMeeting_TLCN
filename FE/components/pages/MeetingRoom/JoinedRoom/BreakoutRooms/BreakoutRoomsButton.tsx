import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { IoGrid } from "react-icons/io5";
import ControlButton from "../Control/ControlButton";
import { BreakoutRoomsModal } from "./BreakoutRoomsModal";

export const BreakoutRoomsButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ControlButton
        onClick={() => setShowModal(!showModal)}
        tooltip={{ content: "Breakout Rooms" }}
      >
        <IoGrid size={18} />
      </ControlButton>
      <BreakoutRoomsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
