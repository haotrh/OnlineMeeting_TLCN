import classNames from "classnames";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { forwardRef, useState } from "react";

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {}

const tickVariants = {
  checked: { pathLength: 1, stroke: "#4F46E5" },
  unchecked: { pathLength: 0, stroke: "#D0D1FB" },
};

const boxVariants = {
  hover: { scale: 1.05, strokeWidth: 50 },
  pressed: { scale: 0.95, strokeWidth: 35 },
  checked: { stroke: "#4F46E5" },
  unchecked: { stroke: "#D0D1FB", strokeWidth: 40 },
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, placeholder, name, id, checked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState<boolean>(checked || false);
    const pathLength = useMotionValue(0);
    const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1]);

    return (
      <motion.div
        initial={false}
        animate={isChecked ? "checked" : "unchecked"}
        whileHover="hover"
        whileTap="pressed"
        className={classNames("flex items-center", className)}
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          className="hidden"
          onChange={(e) => {
            setIsChecked(e.target.checked);
            onChange && onChange(e);
          }}
          ref={ref}
          {...props}
        />
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 440 440"
          onClick={() => setIsChecked(!isChecked)}
          className="mr-1"
        >
          <motion.path
            d="M 72 136 C 72 100.654 100.654 72 136 72 L 304 72 C 339.346 72 368 100.654 368 136 L 368 304 C 368 339.346 339.346 368 304 368 L 136 368 C 100.654 368 72 339.346 72 304 Z"
            fill="transparent"
            variants={boxVariants}
          />
          <motion.path
            d="M 85 120 L 150 190 L 233.5 75"
            transform="translate(60 95)"
            fill="transparent"
            strokeWidth="50"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={tickVariants}
            style={{ pathLength, opacity }}
            custom={isChecked}
          />
        </motion.svg>
        <label htmlFor={id} className="leading-3">
          {placeholder}
        </label>
      </motion.div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
