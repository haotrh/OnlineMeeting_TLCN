import { FiMicOff } from "react-icons/fi";
import { RiPushpin2Line } from "react-icons/ri";

const ParticipantInfo = ({ peer }: { peer: any }) => {
  return (
    <div className="rounded-2xl px-2 py-0.5 flex items-center">
      <div className="mr-3 flex-shrink-0">
        <div className="w-10 h-10 bg-black rounded-full"></div>
      </div>
      <div className="flex-shrink-0 font-semibold text-[14px] text-gray-700">
        {peer.name}
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
