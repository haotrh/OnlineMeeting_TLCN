import _ from "lodash";
import { useContext } from "react";
import { RoomContext } from "../../../../contexts/RoomContext";
import { PeerAudio } from "./PeerAudio";

export const AudioPeers = () => {
  const { consumers } = useContext(RoomContext);

  const micConsumers = _.values(consumers).filter((consumer) => {
    return consumer.appData.source === "mic";
  });

  return (
    <>
      {micConsumers.map((micConsumer) => (
        <PeerAudio
          audioTrack={micConsumer.track}
          key={`audio${micConsumer.id}`}
        />
      ))}
    </>
  );
};
