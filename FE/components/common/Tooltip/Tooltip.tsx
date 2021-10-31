import Tippy, { TippyProps } from "@tippyjs/react/headless";
import { motion, useSpring } from "framer-motion";

const Tooltip = (props: TippyProps) => {
  const opacity = useSpring(0, {
    duration: 80,
  });

  const onMount = () => {
    opacity.set(1);
  };

  const onHide = ({ unmount }: any) => {
    const cleanup = opacity.onChange((value) => {
      if (value <= 0) {
        cleanup();
        unmount();
      }
    });

    opacity.set(0);
  };

  return (
    <Tippy
      animation={true}
      onMount={onMount}
      onHide={onHide}
      delay={[350, 50]}
      {...props}
      render={(attrs, content) => (
        <motion.div
          tabIndex={-1}
          style={{ opacity }}
          className="bg-[rgb(40,40,40)] py-2 px-3.5 rounded-lg shadow-md text-sm text-white font-poppins"
          {...attrs}
        >
          {props.content ?? content}
        </motion.div>
      )}
    >
      {props.children}
    </Tippy>
  );
};

export default Tooltip;
