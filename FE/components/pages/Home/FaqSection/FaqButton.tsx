import classNames from "classnames";

interface FaqButtonProps {
  children?: React.ReactNode;
  active: boolean;
  onClick: () => any;
}

const FaqButton = ({ children, active, onClick }: FaqButtonProps) => (
  <button
    onClick={onClick}
    className={classNames("text-sm font-semibold p-2 w-full rounded-md", {
      "text-white bg-blue-500": active,
      "text-gray-500 hover:bg-gray-100": !active,
    })}
  >
    {children}
  </button>
);

export default FaqButton;
