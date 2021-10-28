import classNames from "classnames";
import { forwardRef } from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={classNames(
          className,
          "py-3 px-4 font-semibold bg-gray-50 border w-full " +
            "placeholder-indigo-500/30 border-indigo-200 focus:border-indigo-500"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
