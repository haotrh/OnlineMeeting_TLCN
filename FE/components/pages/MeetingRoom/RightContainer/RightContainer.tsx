import { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiUser } from "react-icons/hi";
import BoxButton from "./BoxButton";
import MessageBox from "./MessageBox/MessageBox";
import ParticipantBox from "./ParticipantBox/ParticipantBox";
import SettingBox from "./SettingBox/SettingBox";

enum ContainerBoxType {
  MESSAGES,
  PARTICIPANTS,
  SETTINGS,
}

const RightContainer = () => {
  const [currentBox, setCurrentBox] = useState<ContainerBoxType>(
    ContainerBoxType.MESSAGES
  );

  const changeBox = (boxType: ContainerBoxType) => {
    if (currentBox !== boxType) {
      setCurrentBox(boxType);
    }
  };

  return (
    <div className="bg-[#EEF2F8] w-[360px] rounded-2xl flex flex-col overflow-hidden relative">
      <div
        className="absolute w-full bg-[#EEF2F8] h-[60px] text-[14px] flex border-b
      border-gray-300 bg-opacity-30 backdrop-blur-md"
      >
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.MESSAGES}
          icon={BiMessageSquareDetail}
          onClick={() => changeBox(ContainerBoxType.MESSAGES)}
          text="Messages"
        />
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.PARTICIPANTS}
          icon={HiUser}
          onClick={() => changeBox(ContainerBoxType.PARTICIPANTS)}
          text="Participants (32)"
        />
        <BoxButton
          className="px-5"
          active={currentBox === ContainerBoxType.SETTINGS}
          icon={AiFillSetting}
          onClick={() => changeBox(ContainerBoxType.SETTINGS)}
          text=""
        />
      </div>
      <MessageBox hidden={currentBox !== ContainerBoxType.MESSAGES} />
      <ParticipantBox hidden={currentBox !== ContainerBoxType.PARTICIPANTS} />
      {currentBox === ContainerBoxType.SETTINGS && <SettingBox />}
    </div>
  );
};

export default RightContainer;
