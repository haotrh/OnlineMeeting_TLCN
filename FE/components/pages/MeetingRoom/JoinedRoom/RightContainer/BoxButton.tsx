import classNames from "classnames";
import { IconType } from "react-icons";

interface BoxButtonProps {
  active: boolean;
  icon: IconType;
  text: string;
  onClick: () => any;
  className?: string;
}

const BoxButton = ({
  active,
  icon,
  text,
  onClick,
  className,
}: BoxButtonProps) => {
  const Icon = icon;

  return (
    <button
      onClick={onClick}
      className={classNames(className, "font-bold border", {
        "bg-indigo-300/30 text-indigo-500": active,
        "text-gray-500 hover:bg-gray-300/[0.5]": !active,
      })}
    >
      <Icon className="mr-2 text-lg" /> {text}
    </button>
  );
};

export default BoxButton;
