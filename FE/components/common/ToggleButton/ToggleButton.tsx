import classNames from "classnames";
import React, { useState } from "react";

export interface ToggleButtonProps {
  defaultState?: boolean;
  render: (state: boolean) => any;
  onClassName?: string;
  offClassName?: string;
  className?: string;
  disableToggle?: boolean;
  preventToggle?: boolean;
  onClick?: (on: boolean) => any;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      render,
      defaultState,
      onClassName = "",
      offClassName = "",
      disableToggle = false,
      preventToggle = false,
      className,
      onClick,
    },
    ref
  ) => {
    const [buttonState, setButtonState] = useState<boolean>(
      defaultState ?? false
    );

    const handleClick = () => {
      if (!disableToggle && preventToggle) {
        return;
      }
      !disableToggle && setButtonState(!buttonState);
      onClick && onClick(!buttonState);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={classNames(
          className,
          buttonState && !disableToggle ? onClassName : offClassName
        )}
      >
        {render(buttonState)}
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
