import classNames from "classnames";
import ParticipantInfo from "./ParticipantInfo";

interface ParticipantBoxProps {
  hidden: boolean;
}

const ParticipantBox = ({ hidden }: ParticipantBoxProps) => {
  return (
    <div
      className={classNames(
        "flex-1 px-4 overflow-y-scroll space-y-3 pt-[72px] pb-3 scrollbar1",
        {
          hidden,
        }
      )}
    >
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
      <ParticipantInfo />
    </div>
  );
};

export default ParticipantBox;
