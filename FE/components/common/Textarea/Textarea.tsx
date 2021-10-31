import classNames from "classnames";
import { forwardRef } from "react";

interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={classNames(
          className,
          "py-2 px-3 focus:outline-none resize-none rounded-md border text-sm font-medium transition-colors " +
            "focus:border-indigo-500 hover:border-gray-400/80 border-gray-300 w-full text-gray-600"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
