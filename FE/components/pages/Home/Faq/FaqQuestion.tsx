import classNames from "classnames";
import { useState } from "react";
import { Collapse } from "react-collapse";
import { BsPlus } from "react-icons/bs";

interface FaqQuestionProps {
  question: string;
}

const FaqQuestion = ({ question }: FaqQuestionProps) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="text-blue-900 font-semibold my-3 cursor-pointer flex justify-between space-x-3"
      >
        <div>{question}</div>
        <div
          className={classNames("transition-transform origin-center text-lg", {
            "rotate-0": !isOpened,
            "rotate-[225deg]": isOpened,
          })}
        >
          <BsPlus />
        </div>
      </div>
      <div className="text-[13px] text-gray-500 font-medium">
        <Collapse isOpened={isOpened}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl purus
          in mollis nunc sed id semper risus in. Morbi tristique senectus et
          netus et malesuada fames ac turpis. Amet tellus cras adipiscing enim
          eu turpis egestas.
        </Collapse>
      </div>
    </div>
  );
};

export default FaqQuestion;
