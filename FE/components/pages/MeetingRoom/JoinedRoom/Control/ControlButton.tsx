import { TippyProps } from "@tippyjs/react";
import classNames from "classnames";
import ToggleButton, {
  ToggleButtonProps,
} from "../../../../common/ToggleButton/ToggleButton";
import Tooltip from "../../../../common/Tooltip/Tooltip";

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
        onClassName="bg-white text-gray-500"
        offClassName="bg-gray-200/25 backdrop-blur text-white"
        className={classNames(
          className,
          "shadow-md w-[36px] h-[36px] overflow-hidden flex-center rounded-full text-[17px] transition relative"
        )}
        {...props}
      />
    </Tooltip>
  );
};

export default ControlButton;
