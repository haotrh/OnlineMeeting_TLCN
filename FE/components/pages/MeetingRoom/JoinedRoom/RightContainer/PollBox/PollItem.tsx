import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import {
  closePoll,
  openPoll,
  removePoll,
} from "../../../../../../lib/redux/slices/polls.slice";
import { Poll } from "../../../../../../types/room.type";
import Popover from "../../../../../common/Popover/Popover";
import { RoomContext } from "../../../../../contexts/RoomContext";
import PollResults from "./PollResults";
import PollSelect from "./PollSelect";

const PollItem = ({ poll }: { poll: Poll }) => {
  const [viewResult, setViewResult] = useState(false);
  const [showPollOptions, setShowPollOptions] = useState(false);

  const isHost = useAppSelector((selector) => selector.me.info.isHost);

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const [pollSince, setPollSince] = useState(moment(poll.timestamp).fromNow());
  const intervalRef = useRef<number | null>(null);

  const handleDelete = () => {
    socket
      .request("host:deletePoll", { pollId: poll.id })
      .then(() => {
        dispatch(removePoll({ pollId: poll.id }));
      })
      .catch((error) => {
        console.log(error);
        toast(error as string);
      });
  };

  const handleCloseOrOpen = () => {
    if (poll.isClosed) {
      socket
        .request("host:openPoll", { pollId: poll.id })
        .then(() => {
          dispatch(openPoll({ pollId: poll.id }));
        })
        .catch((error) => {
          console.log(error);
          toast(error as string);
        });
    } else {
      socket
        .request("host:closePoll", { pollId: poll.id })
        .then(() => {
          dispatch(closePoll({ pollId: poll.id }));
        })
        .catch((error) => {
          console.log(error);
          toast(error as string);
        });
    }
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setPollSince(moment(poll.timestamp).fromNow());
    }, 60000);

    return () => {
      window.clearInterval(intervalRef.current || 0);
    };
  }, []);

  return (
    <>
      <div className="group">
        <div className="flex space-x-2">
          <h2 className="font-bold text-[16px] flex-1 whitespace-pre-wrap break-words min-w-0">
            {poll.question}
            <span
              className={classNames(
                "inline-block text-[11px] font-semibold py-0.5 px-1.5 rounded-md select-none align-middle ml-1.5",
                {
                  "bg-red-100 text-red-600": poll.isClosed,
                  "bg-indigo-100 text-indigo-600": !poll.isClosed,
                }
              )}
            >
              {poll.isClosed ? "Closed" : "Open"}
            </span>
            {/* {!_.isUndefined(poll.voted) && (
              <span
                className={classNames(
                  "bg-emerald-100 text-emerald-600 inline-block text-[11px] font-semibold py-0.5 px-1.5 rounded-md select-none align-middle ml-1.5"
                )}
              >
                Voted
              </span>
            )} */}
          </h2>
          {isHost && (
            <Popover
              onClickOutside={() => setShowPollOptions(false)}
              interactive={true}
              visible={showPollOptions}
              placement="bottom-start"
              offset={[0, 0]}
              content={
                <div
                  className="bg-white select-none shadow-md border rounded divide-y min-w-[160px] py-1.5"
                  onClick={() => setShowPollOptions(false)}
                >
                  <button
                    onClick={handleCloseOrOpen}
                    className="w-full py-1 px-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center"
                  >
                    {poll.isClosed ? (
                      <>
                        <BiLockOpenAlt size={18} className="mr-3" />
                        <div>Open poll</div>
                      </>
                    ) : (
                      <>
                        <BiLockAlt size={18} className="mr-3" />
                        <div>Close poll</div>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full py-1 px-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center"
                  >
                    <IoRemoveCircleOutline size={18} className="mr-3" />
                    <div>Delete poll</div>
                  </button>
                </div>
              }
            >
              <div className="group-hover:opacity-100 opacity-0 transition-all">
                <button
                  onClick={() => setShowPollOptions(!showPollOptions)}
                  className="p-1"
                >
                  <BsThreeDotsVertical size={16} />
                </button>
              </div>
            </Popover>
          )}
        </div>
        <div className="font-semibold text-gray-500 text-xs flex dot-between mt-1 mb-3">
          <div>
            {poll.options.reduce((sum, option) => option.votes + sum, 0)} votes
          </div>
          <div>{pollSince}</div>
        </div>
        {!_.isUndefined(poll.voted) || viewResult || poll.isClosed ? (
          <PollResults onViewResult={() => setViewResult(false)} poll={poll} />
        ) : (
          <PollSelect onViewResult={() => setViewResult(true)} poll={poll} />
        )}
      </div>
      <hr />
    </>
  );
};

export default PollItem;
