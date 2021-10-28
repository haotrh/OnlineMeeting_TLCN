import classNames from "classnames";
import { toPlainObject } from "lodash";
import { useContext, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiUser } from "react-icons/hi";
import { RoomContext } from "../../../../contexts/RoomContext";
import BoxButton from "./BoxButton";
import MessageBox from "./MessageBox/MessageBox";
import ParticipantBox from "./ParticipantBox/ParticipantBox";
import SettingBox from "./SettingBox/SettingBox";

enum ContainerBoxType {
  MESSAGES,
  PARTICIPANTS,
  SETTINGS,
}

const RightContainer = ({ show }: { show: boolean }) => {
  const { roomInfo } = useContext(RoomContext);

  const [currentBox, setCurrentBox] = useState<ContainerBoxType>(
    ContainerBoxType.MESSAGES
  );

  const changeBox = (boxType: ContainerBoxType) => {
    if (currentBox !== boxType) {
      setCurrentBox(boxType);
    }
  };

  return (
    <div
      className={classNames(
        "bg-[#EEF2F8] rounded-2xl flex flex-col overflow-hidden relative transition-all",
        {
          "translate-x-0 w-[360px]": show,
          "translate-x-[360px] w-0": !show,
        }
      )}
    >
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
          text={`Participants (${JSON.parse(roomInfo.peers).length})`}
        />
      </div>
      <MessageBox hidden={currentBox !== ContainerBoxType.MESSAGES} />
      <ParticipantBox hidden={currentBox !== ContainerBoxType.PARTICIPANTS} />
      {currentBox === ContainerBoxType.SETTINGS && <SettingBox />}
    </div>
  );
};

export default RightContainer;
