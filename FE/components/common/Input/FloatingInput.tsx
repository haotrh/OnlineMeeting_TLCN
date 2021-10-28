import classNames from "classnames";
import { forwardRef } from "react";

interface FloatingInputProps extends React.HTMLProps<HTMLInputElement> {
  containerClassname?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, containerClassname, placeholder, ...props }, ref) => {
    return (
      <div
        className={classNames(
          containerClassname,
          "relative border-b font-semibold border-indigo-500/30 focus-within:border-indigo-700"
        )}
      >
        <input
          className={classNames(
            className,
            "block w-full font-medium appearance-none focus:outline-none my-2 bg-transparent floating-input text-gray-600"
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <label className="absolute top-0 z-[-1] origin-[0%] text-indigo-500/30">
          {placeholder}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
