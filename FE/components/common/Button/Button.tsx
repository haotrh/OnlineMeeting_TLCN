import classNames from "classnames";

export type ButtonStyle = "primary" | "light-primary";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  style?: ButtonStyle;
}

const Button = ({ className, children, style = "primary" }: ButtonProps) => {
  return (
    <button
      className={classNames(
        className,
        "font-medium p-2 rounded-md text-sm",
        {
          "bg-blue-500 text-white ": style === "primary",
          "bg-lightblue": style === "light-primary",
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
