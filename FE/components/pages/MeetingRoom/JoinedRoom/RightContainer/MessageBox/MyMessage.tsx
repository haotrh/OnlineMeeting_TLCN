import classNames from "classnames";
import { MessageType } from "./MessageBox";

interface MyMessageProps {
  messageInfo: MessageType;
}

const MyMessage = ({ messageInfo }: MyMessageProps) => {
  return (
    <div className="flex justify-end max-w-full">
      <div className="ml-3">
        <div className="font-bold text-gray-700 text-[14px] mb-2 text-right">
          You
        </div>
        <div className="text-[14px] font-medium flex flex-col space-y-[5px] items-end">
          {messageInfo.messages.map((message, index) => {
            return (
              <div key={index + message} className="flex items-center">
                <div className="flex-shrink-0 mr-2 text-[11px] font-semibold text-gray-500">
                  3:29 PM
                </div>
                <div
                  className={classNames(
                    "bg-[#D0D3E3] shadow px-3 py-2 rounded-[14px] break-words whitespace-pre-wrap max-w-[240px]",
                    {
                      "rounded-br-none":
                        index === 0 && messageInfo.messages.length > 1,
                      "rounded-tr-none":
                        index === messageInfo.messages.length - 1 &&
                        messageInfo.messages.length > 1,
                      "rounded-r-none":
                        index > 0 && index < messageInfo.messages.length - 1,
                    }
                  )}
                >
                  {message}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyMessage;
