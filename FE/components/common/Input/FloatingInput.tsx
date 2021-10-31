import classNames from "classnames";
import { forwardRef } from "react";

interface FloatingInputProps extends React.HTMLProps<HTMLInputElement> {
  containerClassname?: string;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, containerClassname, placeholder, error, ...props }, ref) => {
    return (
      <div>
        <div
          className={classNames(
            containerClassname,
            "relative border-b font-semibold",
            {
              "border-red-500/30 focus-within:border-red-500": error,
              "border-indigo-500/30 focus-within:border-indigo-700": !error,
            }
          )}
        >
          <input
            className={classNames(
              className,
              { "text-red-500": error, "text-gray-600": !error },
              "block w-full font-semibold font-quicksand appearance-none focus:outline-none my-2 bg-transparent floating-input"
            )}
            placeholder=" "
            ref={ref}
            {...props}
          />
          <label
            className={classNames("absolute top-0 z-[-1] origin-[0%]", {
              "text-red-500/50 error": error,
              "text-indigo-500/50": !error,
            })}
          >
            {placeholder}
          </label>
        </div>
        {error && (
          <div className="text-[12px] text-red-500 font-medium font-poppins">{error}</div>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
