import { motion } from "framer-motion";
import { IoMicCircleOutline, IoMicOutline } from "react-icons/io5";
import { useAppSelector } from "../../../../../../hooks/redux";

const ParticipantVoice = ({ peerId }: { peerId: string }) => {
  const volume = useAppSelector((selector) => selector.peerVolumes[peerId]);
  const noiseThreshold = useAppSelector(
    (selector) => selector.settings.noiseThreshold
  );

  return (
    <div className="relative w-[18px] h-[18px] flex-center">
      <div className="absolute p-1.5 bg-blue-500 text-white rounded-full flex-center z-10">
        <IoMicOutline />
      </div>
      {volume > noiseThreshold && (
        <div className="w-[30px] h-[30px] absolute z-0 flex-center">
          <motion.div
            initial={{ width: "100%", height: "100%", opacity: 1 }}
            animate={{ width: "150%", height: "150%", opacity: 0.2 }}
            transition={{ ease: "linear", duration: 1, repeat: Infinity }}
            className="absolute bg-blue-500/40 p-1 rounded-full"
          />
          <motion.div
            initial={{ width: "100%", height: "100%", opacity: 1 }}
            animate={{ width: "125%", height: "125%", opacity: 0.2 }}
            transition={{
              ease: "linear",
              duration: 1,
              repeat: Infinity,
            }}
            className="absolute bg-blue-500/40 p-1 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default ParticipantVoice;
