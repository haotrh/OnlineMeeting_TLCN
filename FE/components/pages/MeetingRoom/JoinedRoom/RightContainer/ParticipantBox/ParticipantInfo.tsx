import { FiMicOff } from "react-icons/fi";
import { RiPushpin2Line } from "react-icons/ri";
import { Peer } from "../../../../../../types/room.type";

const ParticipantInfo = ({ peer }: { peer: Peer }) => {
  return (
    <div className="rounded-2xl px-2 py-0.5 flex items-center text-gray-700">
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
        <div className="flex-shrink-0 font-semibold text-[14px]">
          {peer.name}
        </div>
        {peer.isHost && <div className="text-[13px] font-semibold text-gray-500">Meeting host</div>}
      </div>
      <div className="flex-1 flex justify-end space-x-1 text-lg">
        <button className="w-10 h-10 hover:bg-gray-200 flex-center rounded-full">
          <FiMicOff />
        </button>
        <button className="w-10 h-10 hover:bg-gray-200 flex-center rounded-full">
          <RiPushpin2Line />
        </button>
      </div>
    </div>
  );
};

export default ParticipantInfo;
