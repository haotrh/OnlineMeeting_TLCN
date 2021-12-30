import { useContext } from "react";
import {
  IoHandLeftSharp, IoMicOff, IoVideocamOff
} from "react-icons/io5";
import { useAppSelector } from "../../../../../../hooks/redux";
import { Peer, SpotlightType } from "../../../../../../types/room.type";
import { RoomContext } from "../../../../../contexts/RoomContext";
import { ParticipantOptions } from "./ParticipantOptions";
import { ParticipantTag } from "./ParticipantTag";
import ParticipantVoice from "./ParticipantVoice";

const ParticipantInfo = ({
  peer,
  screen = false,
  isMe = false,
  onMic,
  onWebcam,
}: {
  peer: Peer;
  screen?: boolean;
  isMe?: boolean;
  onMic: boolean;
  onWebcam: boolean;
}) => {
  const { pinSpotlight } = useContext(RoomContext);

  const onPin = (spotlightType: SpotlightType) => {
    if (isMe) {
      pinSpotlight(
        { type: spotlightType, peerId: peer.id },
        spotlightType === "peer" ? "myview" : "myscreen"
      );
    } else {
      pinSpotlight(
        {
          type: spotlightType,
          peerId: peer.id,
        },
        "otherpeer"
      );
    }
  };

  const { spotlights, pin } = useAppSelector((selector) => selector.room);

  return (
    <div className="px-6 py-2 flex items-center text-gray-700 hover:bg-gray-100/50  transition-colors relative">
      <div className="mr-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={peer.picture}
            alt="avatar"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div>
        <div className="flex-shrink-0 font-bold text-[14px] flex items-center space-x-2">
          <div>{peer.name}</div>
          {isMe && <ParticipantTag name="You" />}
          {peer.isHost && <ParticipantTag name="Host" />}
          {screen && <ParticipantTag name="Sharing" />}
        </div>
        <div className="text-[13px] font-semibold text-gray-500">
          {peer.email}
        </div>
      </div>
      <div className="flex-1 flex justify-end space-x-4 text-lg items-center text-gray-600">
        {onMic && peer.isSpeaking ? (
          <ParticipantVoice peerId={peer.id} />
        ) : (
          <IoMicOff className="text-gray-400" />
        )}
        {!onWebcam && <IoVideocamOff className="text-gray-400" />}
        {peer.raisedHand && <IoHandLeftSharp />}
        <ParticipantOptions
          peer={peer}
          onPin={onPin}
          screen={screen}
          isHost={peer.isHost}
          isMe={isMe}
          isPinned={
            (pin === "myview" && isMe) ||
            (pin === "otherpeer" &&
              spotlights.length > 0 &&
              spotlights[0].peerId === peer.id &&
              spotlights[0].type === "peer")
          }
          isScreenPinned={
            (pin === "myscreen" && isMe) ||
            (pin === "otherpeer" &&
              spotlights.length > 0 &&
              spotlights[0].peerId === peer.id &&
              spotlights[0].type === "screen")
          }
        />
      </div>
    </div>
  );
};

export default ParticipantInfo;
