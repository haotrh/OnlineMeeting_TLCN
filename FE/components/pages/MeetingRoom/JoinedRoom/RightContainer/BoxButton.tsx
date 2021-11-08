import classNames from "classnames";

interface BoxButtonProps {
  active: boolean;
  text: string;
  onClick: () => any;
  className?: string;
}

const BoxButton = ({ active, text, onClick, className }: BoxButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames(className, "font-bold rounded-full py-2", {
        "bg-indigo-300/30 text-indigo-500": active,
        "text-gray-500 hover:bg-gray-300/[0.3]": !active,
      })}
    >
      {text}
    </button>
  );
};

export default BoxButton;
