import { TippyProps } from "@tippyjs/react";
import classNames from "classnames";
import ToggleButton, {
  ToggleButtonProps,
} from "../../../common/ToggleButton/ToggleButton";
import Tooltip from "../../../common/Tooltip/Tooltip";

interface ControlButtonProps extends ToggleButtonProps {
  tooltip: TippyProps;
}

const ControlButton = ({
  className,
  tooltip,
  ...props
}: ControlButtonProps) => {
  return (
    <Tooltip {...tooltip}>
      <ToggleButton
        onClassName="bg-teal-700/[0.2] text-teal-700"
        offClassName="border-[1.5px] border-gray-300 text-gray-400"
        className={classNames(
          className,
          "w-[40px] h-[40px] overflow-hidden flex-center rounded-[14px] text-[17px] transition relative"
        )}
        {...props}
      />
    </Tooltip>
  );
};

export default ControlButton;
