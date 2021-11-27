import classNames from "classnames";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import { addPolls } from "../../../../../../lib/redux/slices/polls.slice";
import Button from "../../../../../common/Button/Button";
import { Select } from "../../../../../common/Select/Select";
import { RoomContext } from "../../../../../contexts/RoomContext";
import CircularLoading from "../../../../../global/Loading/CircularLoading";
import PollDrawer from "./PollDrawer";
import PollItem from "./PollItem";

interface PollProps {
  hidden: boolean;
}

type PollBoxState = "loading" | "error" | "loaded";

type OrderByType =
  | "newest"
  | "oldest"
  | "voted"
  | "unvoted"
  | "open"
  | "closed";

const orderByOptions: { label: string; value: OrderByType }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Voted", value: "voted" },
  { label: "Unvoted", value: "unvoted" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

const optionDirection: {
  [orderBy: string]: "asc" | "desc";
} = {
  newest: "desc",
  oldest: "asc",
  voted: "desc",
  unvoted: "asc",
  open: "asc",
  closed: "desc",
};

const PollBox = ({ hidden }: PollProps) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [pollBoxState, setPollBoxState] = useState<PollBoxState>("loading");

  const [orderBy, setOrderBy] = useState<OrderByType>("newest");

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const polls = useAppSelector((selector) => selector.polls);
  const isHost = useAppSelector((selector) => selector.room.isHost);

  const getPolls = async () => {
    try {
      setPollBoxState("loading");
      const polls = await socket.request("getPolls");
      console.log(polls);

      dispatch(addPolls(polls));
      setPollBoxState("loaded");
    } catch (error) {
      console.log(error);
      setPollBoxState("error");
    }
  };

  useEffect(() => {
    if (!hidden && pollBoxState === "loading") {
      (async () => {
        await getPolls();
      })();
    }
  }, [hidden]);

  return (
    <>
      {!_.isEmpty(polls) && (
        <div
          className={classNames(
            "border-b flex items-end p-4 text-sm font-semibold",
            { hidden: hidden }
          )}
        >
          <div>Order by</div>
          <div>&nbsp;</div>
          <Select
            className="font-bold"
            onChange={(v) => setOrderBy(v)}
            options={orderByOptions}
          />
        </div>
      )}
      <div
        className={classNames(
          "flex-1 p-4 overflow-y-auto space-y-2 scrollbar1 overflow-x-hidden",
          {
            hidden: hidden,
          }
        )}
      >
        {pollBoxState === "loading" && (
          <div className="h-full flex-center">
            <div>Loading</div>
            <CircularLoading size={32} />
          </div>
        )}
        {pollBoxState === "error" && (
          <div className="p-10 text-center">
            <h2 className="font-bold text-[15px] mb-4">Failed to load polls</h2>
            <div>
              <Button
                onClick={getPolls}
                className="font-semibold"
                base="light-primary"
              >
                Try again
              </Button>
            </div>
          </div>
        )}
        {pollBoxState === "loaded" && (
          <>
            {/* No poll */}
            {_.isEmpty(polls) && (
              <div className="p-10 text-center space-y-4 text-[15px]">
                <h2 className="font-bold">Host has not created any poll yet</h2>
                <div className="font-medium">
                  Polls will last until the room is closed.
                </div>
              </div>
            )}
            {/* Have poll */}
            {!_.isEmpty(polls) && (
              <>
                <div className="space-y-4">
                  {_.orderBy(
                    _.values(polls),
                    [
                      (poll) => {
                        switch (orderBy) {
                          case "newest":
                          case "oldest":
                            return poll.timestamp;
                          case "voted":
                          case "unvoted":
                            return !_.isUndefined(poll.voted);
                          case "open":
                          case "closed":
                            return poll.isClosed;
                        }
                      },
                    ],
                    optionDirection[orderBy]
                  ).map((poll) => (
                    <PollItem key={poll.id} poll={poll} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {isHost && (
        <div className={classNames({ hidden })}>
          <div className="flex-center bg-white p-3 border-t border-gray-200">
            <Button
              onClick={() => setIsOpenDrawer(true)}
              className="font-semibold"
            >
              Add a poll
            </Button>
          </div>
        </div>
      )}
      <PollDrawer
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      />
    </>
  );
};

export default PollBox;
