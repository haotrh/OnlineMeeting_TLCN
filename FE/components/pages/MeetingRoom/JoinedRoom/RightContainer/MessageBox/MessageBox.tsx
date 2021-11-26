import classNames from "classnames";
import _ from "lodash";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import useSound from "use-sound";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import { addMessage } from "../../../../../../lib/redux/slices/chat.slice";
import { RoomContext } from "../../../../../contexts/RoomContext";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

export interface MessageType {
  message: string;
  peerId: string;
}

export interface NewMessage {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

interface MessageBoxProps {
  hidden: boolean;
}

const MessageBox = ({ hidden }: MessageBoxProps) => {
  const [text, setText] = useState("");
  const endMessageRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const { socket } = useContext(RoomContext);

  const messages = useAppSelector((selector) => selector.chat);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_.isEmpty(text)) {
      return;
    }

    socket.request("chatMessage", { message: text });

    // dispatch(addMessage({ message: text, peerId: socket.id }));

    setText("");
  };

  const scrollToBottom = () => {
    endMessageRef.current?.scrollIntoView({});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div
        className={classNames(
          "flex-1 p-4 overflow-y-auto space-y-2 scrollbar1",
          {
            hidden: hidden,
          }
        )}
      >
        <div className="text-sm font-medium">
          {messages.map((message, index) =>
            message.peerId === socket.id ? (
              <MyMessage key={`message${index}`} messageInfo={message} />
            ) : (
              <OtherMessage key={`message${index}`} messageInfo={message} />
            )
          )}
          <div ref={endMessageRef} />
        </div>
      </div>
      <div className={classNames({ hidden })}>
        <form
          onSubmit={handleSubmit}
          className="flex bg-white p-2 border-t border-gray-200"
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 focus:outline-none text-[14px] font-semibold mx-2 text-gray-600"
            placeholder="Place your message..."
          />
          <button
            type="submit"
            className="bg-indigo-200 text-indigo-500 bg-opacity-50 hover:bg-opacity-70
            transition-colors w-[36px] h-[36px] flex-center rounded-lg"
          >
            <FaTelegramPlane size={16} />
          </button>
        </form>
      </div>
    </>
  );
};

export default MessageBox;
