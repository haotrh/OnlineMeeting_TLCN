import Tippy, { TippyProps } from "@tippyjs/react/headless";
import { motion, useAnimation, useSpring } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";

const Popover = forwardRef<HTMLDivElement, TippyProps>(
  ({ children, content, ...props }, ref) => {
    // const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
    const controls = useAnimation();

    const onMount = () => {
      controls.start({ opacity: 1, scale: 1 });
    };

    const onHide = ({ unmount }: any) => {
      controls.start({ opacity: 0, scale: 0.7 });
    };

    return (
      <div ref={ref}>
        <Tippy
          onMount={onMount}
          onHide={onHide}
          render={(attrs) => (
            <motion.div
              {...attrs}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls}
              transition={{ duration: 0.1 }}
              className="origin-bottom-left bg-white rounded-md shadow-md relative border"
            >
              <div className="relative z-10">{content}</div>
              {/* <div className="arrow shadow-medium z-0" ref={setArrow} /> */}
            </motion.div>
          )}
          //   popperOptions={{
          //     modifiers: [
          //       {
          //         name: "arrow",
          //         options: {
          //           element: arrow,
          //         },
          //       },
          //     ],
          //   }}
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
