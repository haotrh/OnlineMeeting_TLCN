import classNames from "classnames";
import { forwardRef } from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <>
        <input
          className={classNames(
            className,
            "py-2 px-3 rounded-md border text-sm font-medium transition-colors " +
              "focus:border-indigo-500 hover:border-gray-400/80 border-gray-300 w-full text-gray-600",
            {
              "!border-red-600": error,
            }
          )}
          ref={ref}
          {...props}
        />
        <div className="text-red-600 font-medium text-sm mt-1 ml-1">{error}</div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
