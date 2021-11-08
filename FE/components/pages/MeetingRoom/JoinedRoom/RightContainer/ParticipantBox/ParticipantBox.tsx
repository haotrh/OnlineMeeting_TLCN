import classNames from "classnames";
import { useContext } from "react";
import { RoomContext } from "../../../../../contexts/RoomContext";
import ParticipantInfo from "./ParticipantInfo";

interface ParticipantBoxProps {
  hidden: boolean;
}

const ParticipantBox = ({ hidden }: ParticipantBoxProps) => {
  const { peers } = useContext(RoomContext);

  return (
    <div
      className={classNames(
        "flex-1 p-4 overflow-y-scroll space-y-3 scrollbar1",
        {
          hidden,
        }
      )}
    >
      {peers.map((peer: any) => (
        <ParticipantInfo key={peer.id} peer={peer} />
      ))}
    </div>
  );
};

export default ParticipantBox;
