import { Placement } from "@popperjs/core";
import classNames from "classnames";
import _ from "lodash";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown } from "react-icons/fi";
import Popover from "../Popover/Popover";

export interface OptionType {
  value: any;
  label: string;
}

interface SelectProps {
  options: OptionType[];
  placement?: Placement;
  icon?: IconType;
  onChange: (value: any) => any;
  className?: string;
  defaultValue?: string | null;
}

export const Select = ({
  options,
  placement,
  icon,
  className,
  onChange,
  defaultValue,
}: SelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultValue ? _.findIndex(options, ["value", defaultValue]) : 0
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = icon;

  const handleOptionClick = (value: any, index: number) => {
    onChange(value);
    setSelectedIndex(index);
    setIsExpanded(false);
  };

  return (
    <Popover
      interactive={true}
      visible={isExpanded}
      onClickOutside={() => setIsExpanded(false)}
      placement={placement ?? "bottom"}
      content={
        <div className="shadow-lg p-[10px] rounded-md bg-white min-w-[180px] border space-y-2 w-full">
          {options.map((option, index) => (
            <div
              key={option.label + option.value + `option` + index}
              onClick={() => handleOptionClick(option.value, index)}
              className={classNames(
                "py-[6px] px-[10px] text-sm cursor-pointer " +
                  "transition-colors rounded-md",
                {
                  "bg-indigo-50/60 font-semibold text-indigo-600":
                    index === selectedIndex,
                  "hover:bg-indigo-50/60 font-semibold text-gray-600":
                    index !== selectedIndex,
                }
              )}
            >
              {option.label}
            </div>
          ))}
        </div>
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={classNames(
          className,
          "font-medium text-sm select-none flex items-center justify-between space-x-1.5 " +
            "hover:text-blue-700 cursor-pointer transition-colors",
          { "text-blue-700": isExpanded }
        )}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-3" size={20} />}
          <div>{options[selectedIndex].label}</div>
        </div>
        <FiChevronDown
          className={classNames("transition-transform", {
            "rotate-180": isExpanded,
            "rotate-0": !isExpanded,
          })}
        />
      </div>
    </Popover>
  );
};
