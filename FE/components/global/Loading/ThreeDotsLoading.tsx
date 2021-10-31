import { motion, Variant } from "framer-motion";
import _ from "lodash";

export const ThreeDotsLoading = () => {
  const item: { animated: Variant } = {
    animated: {
      scale: [1, 1.3, 1.3, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
        times: [0, 0.4, 0.6, 1],
      },
      background: [
        "rgb(200,201,202)",
        "rgb(118,120,122)",
        "rgb(118,120,122)",
        "rgb(200,201,202)",
      ],
    },
  };

  return (
    <motion.div
      transition={{ staggerChildren: 0.3 }}
      animate="animated"
      className="flex space-x-[7px]"
    >
      {_.range(3).map((i) => (
        <motion.div
          key={`loadingcircle${i}`}
          variants={item}
          className="w-[6px] h-[6px] rounded-full"
        />
      ))}
    </motion.div>
  );
};
