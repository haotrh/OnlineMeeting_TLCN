import classNames from "classnames";
import { useState } from "react";
import Button from "../../../../../common/Button/Button";
import PollDrawer from "./PollDrawer";

interface PollProps {
  hidden: boolean;
}

const PollBox = ({ hidden }: PollProps) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

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
          <Button
            onClick={() => setIsOpenDrawer(true)}
            className="font-semibold"
          >
            Add a poll
          </Button>
        </div>
      </div>
      <PollDrawer
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      />
    </>
  );
};

export default PollBox;
