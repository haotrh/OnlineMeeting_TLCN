/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { MessageType } from "./MessageBox";

interface OtherMessageProps {
  messageInfo: MessageType;
}

const OtherMessage = ({ messageInfo }: OtherMessageProps) => {
  return (
    <div className="flex max-w-full">
      <div className="flex pt-1">
        <div className="w-9 h-9 rounded-full ring-white ring-[2px] overflow-hidden">
          <img src={messageInfo.avatar} alt="avatar" />
        </div>
      </div>
      <div className="flex-grow flex-shrink-0 ml-3">
        <div className="font-bold text-gray-700 text-[14px] mb-2">
          {messageInfo.name}
        </div>
        <div className="text-[14px] font-medium flex flex-col space-y-[5px]">
          {messageInfo.messages.map((message, index) => {
            return (
              <div
                key={index + message}
                className="flex items-center"
              >
                <div
                  className={classNames(
                    "pr-4 py-2 break-words whitespace-pre-wrap max-w-[220px] text-gray-700",
                    {
                      "rounded-bl-none":
                        index === 0 && messageInfo.messages.length > 1,
                      "rounded-tl-none":
                        index === messageInfo.messages.length - 1 &&
                        messageInfo.messages.length > 1,
                      "rounded-l-none":
                        index > 0 && index < messageInfo.messages.length - 1,
                    }
                  )}
                >
                  {message}
                </div>
                <div className="ml-2 text-[11px] font-semibold text-gray-500 flex-shrink-0">
                  1:30 AM
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
