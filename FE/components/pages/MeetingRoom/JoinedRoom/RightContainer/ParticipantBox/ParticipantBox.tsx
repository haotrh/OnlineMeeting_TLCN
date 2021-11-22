import classNames from "classnames";
import _ from "lodash";
import React, { useContext } from "react";
import { useAppSelector } from "../../../../../../hooks/redux";
import { Peer } from "../../../../../../types/room.type";
import { RoomContext } from "../../../../../contexts/RoomContext";
import ParticipantInfo from "./ParticipantInfo";

interface ParticipantBoxProps {
  hidden: boolean;
}

const ParticipantBox = ({ hidden }: ParticipantBoxProps) => {
  const peers = useAppSelector((selector) => selector.peers);
  const info = useAppSelector((selector) => selector.me.info);
  const settings = useAppSelector((selector) => selector.settings);
  const { screenProducer } = useContext(RoomContext);

  return (
    <div
      className={classNames(
        "flex-1 py-4 overflow-y-scroll space-y-3 scrollbar1",
        { hidden }
      )}
    >
      <ParticipantInfo
        isMe={true}
        onMic={!settings.audioMuted}
        onWebcam={!settings.videoMuted}
        peer={info}
        screen={Boolean(screenProducer)}
      />
      {_.values(peers).map((peer: Peer, index) => (
        <React.Fragment key={peer.id}>
          <ParticipantInfo
            peer={peer}
            screen={Boolean(peer.screenConsumer)}
            onWebcam={Boolean(peer.webcamConsumer)}
            onMic={false}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ParticipantBox;
