import classNames from "classnames";
import { useEffect, useState } from "react";

export interface TextTypingProps {
  words: Array<string>;
  typeSpeed: number;
  backSpeed: number;
  waitToRemove: number;
  waitToStart: number;
  className?: string;
}

enum TypeState {
  ADD = "add",
  REMOVE = "remove",
}

export const TextTyping = ({
  words,
  backSpeed,
  typeSpeed,
  waitToRemove,
  waitToStart,
  className,
}: TextTypingProps) => {
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<TypeState>(TypeState.ADD);

  useEffect(() => {
    switch (state) {
      case TypeState.ADD:
        if (count === words[index].length) {
          setTimeout(() => {
            setState(TypeState.REMOVE);
          }, waitToRemove - backSpeed);
        } else {
          setTimeout(() => {
            setCount(count + 1);
          }, typeSpeed);
        }
        break;
      case TypeState.REMOVE:
        if (count === 0) {
          setTimeout(() => {
            setState(TypeState.ADD);
            if (index === words.length - 1) {
              setIndex(0);
            } else {
              setIndex(index + 1);
            }
          }, waitToStart - typeSpeed);
        } else {
          setTimeout(() => {
            setCount(count - 1);
          }, backSpeed);
        }
        break;
    }
  }, [count, state]);

  return (
    <div className={className}>
      {words[index]
        .slice(0, count)
        .split("")
        .map((value, index) => {
          return <span key={index}>{value}</span>;
        })}
      <span
        className={classNames("max-w-[0.25px] bg-black inline-block", {
          hidden: count === 0,
          blink: count === words[index].length,
        })}
      >
        &nbsp;
      </span>
      <span className="invisible w-0">&nbsp;</span>
    </div>
  );
};
