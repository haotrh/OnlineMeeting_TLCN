import classNames from "classnames";
import { useContext, useState } from "react";
import { FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { addPoll } from "../../../../../../lib/redux/slices/polls.slice";
import { Poll } from "../../../../../../types/room.type";
import Button from "../../../../../common/Button/Button";
import Checkbox from "../../../../../common/Checkbox/Checkbox";
import Tooltip from "../../../../../common/Tooltip/Tooltip";
import { RoomContext } from "../../../../../contexts/RoomContext";

const PollSelect = ({
  poll,
  onViewResult,
}: {
  poll: Poll;
  onViewResult: () => any;
}) => {
  const [optionIndex, setOptionIndex] = useState(-1);
  const { socket } = useContext(RoomContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (optionIndex === -1) return;

    setIsSubmitting(true);
    socket
      .request("votePoll", { pollId: poll.id, optionIndex })
      .then((newPoll) => {
        dispatch(addPoll(newPoll));
      })
      .catch((error) => {
        console.log(error);
        toast(error as string);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="space-y-2 mb-3">
        {poll.options.map((option, index) => (
          <div
            key={`${poll.id}option${index}choose`}
            onClick={() => {
              if (optionIndex === index) setOptionIndex(-1);
              else setOptionIndex(index);
            }}
            className={classNames(
              "cursor-pointer py-2 px-3 border rounded-md flex items-center space-x-2 text-sm " +
                "font-medium hover:bg-gray-100/40 transition-colors",
              {
                "ring-1 ring-blue-400": index === optionIndex,
              }
            )}
          >
            <Checkbox
              isCheck={optionIndex === index}
              className="pointer-events-none"
            />
            <div>{option.option}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <Button
          disabled={isSubmitting}
          className="font-semibold"
          onClick={handleSubmit}
        >
          Submit vote
        </Button>
        <Tooltip content="See results">
          <button
            className="transition-colors hover:bg-gray-200 bg-gray-100 h-9 w-9 flex-center rounded-lg"
            onClick={onViewResult}
          >
            <FiEye />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

export default PollSelect;
