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
      className={classNames(className, "font-bold", {
        "bg-teal-600/[0.125] text-teal-600": active,
        "text-gray-500 hover:bg-gray-300/[0.5]": !active,
      })}
    >
      <Icon className="mr-1 text-lg" /> {text}
    </button>
  );
};

export default BoxButton;
