import classNames from "classnames";
import { useState } from "react";
import { IconType } from "react-icons";
import { AiOutlineClose, AiOutlineSetting } from "react-icons/ai";
import { BiDevices } from "react-icons/bi";
import { useAppSelector } from "../../../../../hooks/redux";
import Button from "../../../../common/Button/Button";
import Modal from "../../../../common/Modal/Modal";
import GeneralSettings from "./GeneralSettings";
import MediaSettings from "./MediaSettings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => any;
}

interface TabProps {
  active: boolean;
  label: string;
  onClick: (data?: any) => any;
  icon: IconType;
}

const Tab = ({ label, active, onClick, icon }: TabProps) => {
  const Icon = icon;

  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex transition-all items-center py-3 px-7 font-medium font-be cursor-pointer text-[15px]",
        {
          "bg-blue-100 bg-opacity-70 hover:bg-opacity-90 text-blue-700": active,
          "hover:bg-gray-50 text-gray-500": !active,
        }
      )}
    >
      <Icon className="mr-3" size={22} />
      {label}
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [currentTab, setCurrentTab] = useState<"media" | "general">("media");
  const isHost = useAppSelector((selector) => selector.room.isHost);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[800px] h-screen py-12 pointer-events-none"
    >
      <div className="bg-white my-auto flex w-full rounded-lg h-full pointer-events-auto">
        <div className="w-[256px] border-r">
          <h2 className="p-6 text-[22px] font-medium">Settings</h2>
          <ul>
            <li>
              <Tab
                label="Media"
                onClick={() => setCurrentTab("media")}
                active={currentTab === "media"}
                icon={BiDevices}
              />
            </li>
            {isHost && (
              <li>
                <Tab
                  label="General"
                  onClick={() => setCurrentTab("general")}
                  active={currentTab === "general"}
                  icon={AiOutlineSetting}
                />
              </li>
            )}
          </ul>
        </div>
        <div className="flex-1">
          <div className="p-2 flex justify-end">
            <button className="w-12 h-12 hover:bg-gray-100 flex-center rounded-full transition-colors">
              <AiOutlineClose onClick={onClose} size={20} />
            </button>
          </div>
          {currentTab === "media" && <MediaSettings onClose={onClose} />}
          {currentTab === "general" && <GeneralSettings />}
        </div>
      </div>
    </Modal>
  );
};
