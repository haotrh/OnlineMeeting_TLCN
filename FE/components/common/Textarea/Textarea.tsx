import classNames from "classnames";
import { forwardRef } from "react";

interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <>
        <textarea
          className={classNames(
            className,
            "py-2 px-3 focus:outline-none resize-none rounded-md border text-sm font-medium transition-colors " +
              "focus:border-indigo-500 hover:border-gray-400/80 border-gray-300 w-full text-gray-600",
            {
              "!border-red-600": error,
            }
          )}
          ref={ref}
          {...props}
        />
        <div className="text-red-600 font-medium text-sm mt-1 ml-1">
          {error}
        </div>
      </>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
