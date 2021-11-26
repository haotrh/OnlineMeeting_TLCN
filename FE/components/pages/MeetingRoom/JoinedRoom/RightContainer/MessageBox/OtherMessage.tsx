/* eslint-disable @next/next/no-img-element */
import { Message } from "../../../../../../lib/redux/slices/chat.slice";

interface OtherMessageProps {
  messageInfo: Message;
}

const OtherMessage = ({ messageInfo }: OtherMessageProps) => {
  return (
    <div className="flex max-w-full mb-3">
      <div className="flex pt-1">
        <div className="w-9 h-9 rounded-full ring-white ring-[2px] overflow-hidden">
          <img src={messageInfo.picture} alt="avatar" />
        </div>
      </div>
      <div className="flex-grow flex-shrink-0 ml-3">
        <div className="font-bold text-gray-700 text-[14px] mb-2">
          {messageInfo.name}
        </div>
        <div className="text-[14px] font-medium flex flex-col space-y-[5px]">
          <div className="flex items-center">
            <div
              className="py-2 px-3 break-words whitespace-pre-wrap max-w-[220px] text-gray-700
            bg-indigo-200/30 rounded-full rounded-tl-none font-semibold"
            >
              {messageInfo.message}
            </div>
            <div className="ml-2 text-[11px] font-semibold text-gray-500 flex-shrink-0">
              {messageInfo.timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
