import { motion } from "framer-motion";
import { useAppSelector } from "../../../../../hooks/redux";

const PeerVolume = ({ peerId }: { peerId: string }) => {
  const volume = useAppSelector((selector) => selector.peerVolumes[peerId]);
  const noiseThreshold = useAppSelector(
    (selector) => selector.settings.noiseThreshold
  );

  return (
    <>
      {volume && volume > noiseThreshold ? (
        <div className="absolute top-0 left-0 w-full h-full flex-center z-0">
          <motion.div
            initial={{ width: "100%", height: "100%" }}
            animate={{
              width: `${
                100 +
                Math.round(
                  50 *
                    (Math.abs((volume - noiseThreshold) / noiseThreshold) + 0.2)
                )
              }%`,
              height: `${
                100 +
                Math.round(
                  50 *
                    (Math.abs((volume - noiseThreshold) / noiseThreshold) + 0.2)
                )
              }%`,
            }}
            className="bg-white/10 absolute rounded-full"
          />
          <motion.div
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: "175%", height: "175%", opacity: 0 }}
            transition={{ ease: "linear", duration: 1.75, repeat: Infinity }}
            className="absolute rounded-full border"
          />
        </div>
      ) : null}
    </>
  );
};

export default PeerVolume;
