import classNames from "classnames";
import _ from "lodash";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import Button from "../../../../../common/Button/Button";

interface QuestionProps {
  hidden: boolean;
}

const QuestionBox = ({ hidden }: QuestionProps) => {
  return (
    <>
      <div
        className={classNames(
          "flex-1 p-4 overflow-y-auto space-y-2 scrollbar1",
          {
            hidden: hidden,
          }
        )}
      ></div>
      <div className={classNames({ hidden })}>
        <div className="flex-center bg-white p-3 border-t border-gray-200">
          <Button className="font-semibold">Ask a new question</Button>
        </div>
      </div>
    </>
  );
};

export default QuestionBox;
