import classNames from "classnames";
import { useContext } from "react";
import { FiChevronRight } from "react-icons/fi";
import {
  SettingsPageContext,
  SettingsPageTabs,
} from "../../../../pages/app/settings";

interface SettingsMenuLinkProps {
  name: string;
  value: SettingsPageTabs;
}

const SettingsMenuLink = ({ name, value }: SettingsMenuLinkProps) => {
  const { currentTab, setCurrentTab } = useContext(SettingsPageContext) as any;

  const active = currentTab === value;

  return (
    <div className="px-3">
      <div
        onClick={() => setCurrentTab(value)}
        className={classNames(
          "px-4 cursor-pointer py-2 relative rounded-md text-sm group transition-colors duration-100",
          {
            "bg-indigo-100/40 text-blue-500 font-bold": active,
            "hover:bg-indigo-100/40 hover:text-blue-500 font-semibold text-gray-600":
              !active,
          }
        )}
      >
        {name}
        <div
          className={classNames(
            "absolute right-0 top-0 h-full px-1.5 justify-center items-center text-blue-500",
            {
              "hidden group-hover:!flex": !active,
              flex: active,
            }
          )}
        >
          <FiChevronRight />
        </div>
      </div>
    </div>
  );
};

export default SettingsMenuLink;
