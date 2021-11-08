import Tippy, { TippyProps } from "@tippyjs/react/headless";
import classNames from "classnames";
import { motion, useAnimation } from "framer-motion";
import { forwardRef } from "react";

const Popover = forwardRef<HTMLDivElement, TippyProps>(
  ({ children, content, placement, className, ...props }, ref) => {
    const controls = useAnimation();

    const onMount = () => {
      controls.start({ opacity: 1, scale: 1 });
    };

    const onHide = ({ unmount }: any) => {
      console.log("Hide");
      controls.start({ opacity: 0, scale: 0.7 });
    };

    return (
      <div ref={ref}>
        <Tippy
          onMount={onMount}
          onHide={onHide}
          placement={placement}
          render={(attrs) => (
            <motion.div
              {...attrs}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls}
              transition={{ duration: 0.1 }}
              className={classNames("relative", className, {
                "origin-bottom-left": className,
              })}
            >
              <div className="relative z-10">{content}</div>
            </motion.div>
          )}
          {...props}
        >
          {children}
        </Tippy>
      </div>
    );
  }
);

Popover.displayName = "Popover";

export default Popover;
