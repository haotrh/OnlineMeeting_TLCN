import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import ControlButton from "../Control/ControlButton";
import { SettingsModal } from "./SettingsModal";

export const SettingsButton = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <ControlButton
        onClick={() => setShowSettings(!showSettings)}
        tooltip={{ content: "More options" }}
      >
        <AiOutlineSetting size={21} />
      </ControlButton>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};
