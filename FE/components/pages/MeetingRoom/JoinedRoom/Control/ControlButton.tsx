import { TippyProps } from "@tippyjs/react";
import classNames from "classnames";
import { ReactNode } from "react";
import Tooltip from "../../../../common/Tooltip/Tooltip";

interface ControlButtonProps {
  tooltip: TippyProps;
  children?: ReactNode;
  onClick?: (data?: any) => any;
  on?: boolean;
  preventClick?: boolean;
  disabled?: boolean;
}

const ControlButton = ({
  tooltip,
  children,
  onClick,
  on = false,
  preventClick = false,
}: ControlButtonProps) => {
  return (
    <Tooltip {...tooltip}>
      <button
        onClick={() => {
          !preventClick && onClick && onClick();
        }}
        className={classNames(
          "w-[38px] h-[38px] overflow-hidden flex-center rounded-full text-[17px] transition relative",
          {
            "bg-white text-[#3C4043]": on && !preventClick,
            "bg-[#3C4043] backdrop-blur text-white":
              !on && !preventClick,
            "bg-[#3C4043] backdrop-blur text-[#7A7C80] !cursor-default":
              preventClick,
          }
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default ControlButton;
