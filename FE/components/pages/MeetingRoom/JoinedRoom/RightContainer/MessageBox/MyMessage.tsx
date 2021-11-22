import { Message } from "../../../../../../lib/redux/slices/chat.slice";

interface MyMessageProps {
  messageInfo: Message;
}

const MyMessage = ({ messageInfo }: MyMessageProps) => {
  return (
    <div className="flex justify-end max-w-full mb-1.5">
      <div className="flex items-center">
        <div className="mr-2 text-[11px] font-semibold text-gray-500 flex-shrink-0">
          {messageInfo.timestamp}
        </div>
        <div
          className="px-3 py-2 break-words whitespace-pre-wrap max-w-[240px]
         bg-indigo-500/90 text-white rounded-full"
        >
          {messageInfo.message}
        </div>
      </div>
    </div>
  );
};

export default MyMessage;
