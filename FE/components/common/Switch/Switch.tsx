import classNames from "classnames";
import { motion } from "framer-motion";

interface SwitchProps {
  active: boolean;
  onClick: () => any;
  disabled?: boolean;
  width?: number;
  circleSize?: number;
}

const Switch = ({
  active,
  disabled,
  onClick,
  width = 50,
  circleSize = 16,
}: SwitchProps) => {
  return (
    <button
      type="button"
      style={{ width }}
      className={classNames(
        "rounded-full p-1 relative flex transition-colors",
        {
          "bg-blue-500": active && !disabled,
          "bg-[#9DC0FA]": active && disabled,
          "bg-[#DADDE2]": !active && !disabled,
          "bg-[#EDEEF1]": !active && disabled,
          "cursor-default": disabled,
        }
      )}
      onClick={() => {
        !disabled && onClick();
      }}
    >
      <motion.div
        initial={{ left: active ? width - circleSize - 8 : 0 }}
        animate={active ? { left: width - circleSize - 8 } : { left: 0 }}
        style={{ width: circleSize, height: circleSize }}
        className={
          "relative top-0 rounded-full transition-colors bg-white shadow-md"
        }
      />
    </button>
  );
};

export default Switch;
