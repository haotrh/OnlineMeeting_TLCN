import classNames from "classnames";
import Button from "../../../../../common/Button/Button";

interface PollProps {
  hidden: boolean;
}

const PollBox = ({ hidden }: PollProps) => {
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
          <Button className="font-semibold">Add a poll</Button>
        </div>
      </div>
    </>
  );
};

export default PollBox;
