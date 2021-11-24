import { motion } from "framer-motion";
import { useState } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import BoxButton from "./BoxButton";
import MessageBox from "./MessageBox/MessageBox";
import ParticipantBox from "./ParticipantBox/ParticipantBox";
import PollBox from "./PollBox/PollBox";
import QuestionBox from "./QuestionBox/QuestionBox";

enum ContainerBoxType {
  MESSAGES,
  QUESTIONS,
  POLLS,
  PEOPLE,
  SETTINGS,
}

const RightContainer = ({ show }: { show: boolean }) => {
  const peers = useAppSelector((selector) => selector.peers);

  const [currentBox, setCurrentBox] = useState<ContainerBoxType>(
    ContainerBoxType.MESSAGES
  );

  const changeBox = (boxType: ContainerBoxType) => {
    if (currentBox !== boxType) {
      setCurrentBox(boxType);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={
        show
          ? {
              marginLeft: 0,
              translateX: 0,
            }
          : {
              marginLeft: -480,
              translateX: "100%",
            }
      }
      transition={{
        ease: "easeInOut",
        duration: 0.01,
      }}
      className="flex flex-col transition-all w-[480px] h-full bg-white text-gray-800"
    >
      <div className="text-[14px] flex border-b space-x-1.5 border-gray-200 p-4">
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.MESSAGES}
          onClick={() => changeBox(ContainerBoxType.MESSAGES)}
          text="Messages"
        />
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.QUESTIONS}
          onClick={() => changeBox(ContainerBoxType.QUESTIONS)}
          text="Questions"
        />
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.POLLS}
          onClick={() => changeBox(ContainerBoxType.POLLS)}
          text="Polls"
        />
        <BoxButton
          className="flex-1 flex-center"
          active={currentBox === ContainerBoxType.PEOPLE}
          onClick={() => changeBox(ContainerBoxType.PEOPLE)}
          text={`People (${Object.keys(peers).length + 1})`}
        />
      </div>
      <MessageBox hidden={currentBox !== ContainerBoxType.MESSAGES} />
      <QuestionBox hidden={currentBox !== ContainerBoxType.QUESTIONS} />
      <PollBox hidden={currentBox !== ContainerBoxType.POLLS} />
      <ParticipantBox hidden={currentBox !== ContainerBoxType.PEOPLE} />
    </motion.div>
  );
};

export default RightContainer;
