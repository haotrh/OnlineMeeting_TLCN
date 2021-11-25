import classNames from "classnames";
import { motion } from "framer-motion";
import _ from "lodash";
import percentRound from "percent-round";
import { useMemo, useState } from "react";
import { GrSelect } from "react-icons/gr";
import { Poll } from "../../../../../../types/room.type";
import Checkbox from "../../../../../common/Checkbox/Checkbox";
import Tooltip from "../../../../../common/Tooltip/Tooltip";

const PollResults = ({
  poll,
  onViewResult,
}: {
  poll: Poll;
  onViewResult: () => any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const percentages = useMemo(() => {
    return percentRound(poll.options.map((option) => option.votes));
  }, [poll.options]);

  return (
    <>
      <div className="space-y-2 mb-3">
        {poll.options.map((option, index) => (
          <div
            key={`${poll.id}option${index}`}
            onClick={() => {
              selectedIndex === index
                ? setSelectedIndex(-1)
                : setSelectedIndex(index);
            }}
            className={classNames(
              "font-semibold flex justify-between overflow-hidden rounded-md py-2 px-3 items-center relative select-none text-sm",
              {
                "ring-1": poll.voted === index,
                border: poll.voted !== index,
              }
            )}
          >
            <div className="text-blue-600 relative z-10 flex">
              {poll.voted === index && (
                <Checkbox isCheck={true} className="pointer-events-none" />
              )}
              {option.option}
            </div>
            <div className="relative z-10">
              {option.votes} ({percentages[index]}%)
            </div>
            <motion.div
              animate={{ width: `${percentages[index]}%` }}
              transition={{ type: "keyframes", duration: 0.5 }}
              className="absolute top-0 left-0 h-full bg-blue-100/70 z-0"
            />
          </div>
        ))}
      </div>
      {_.isUndefined(poll.voted) && !poll.isClosed && (
        <div className="flex items-center space-x-3">
          <Tooltip content="Select vote">
            <button
              className="transition-colors hover:bg-gray-200 bg-gray-100 h-9 w-9 flex-center rounded-lg"
              onClick={onViewResult}
            >
              <GrSelect />
            </button>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default PollResults;
