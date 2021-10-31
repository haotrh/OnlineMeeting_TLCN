import classNames from "classnames";
import { forwardRef } from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={classNames(
          className,
          "py-2 px-3 rounded-md border text-sm font-medium transition-colors " +
            "focus:border-indigo-500 hover:border-gray-400/80 border-gray-300 w-full text-gray-600"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
