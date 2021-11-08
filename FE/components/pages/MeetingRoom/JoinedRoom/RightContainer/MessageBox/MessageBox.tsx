import classNames from "classnames";
import _ from "lodash";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

export interface MessageType {
  id: string;
  name: string;
  avatar: string;
  messages: Array<string>;
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

  const [messages, setMessages] = useState<Array<MessageType>>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_.isEmpty(text)) {
      return;
    }
    const info = [
      {
        id: "1",
        name: "Hao",
        avatar:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      },
      {
        id: "2",
        name: "Alexander",
        avatar:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y",
      },
      {
        id: "3",
        name: "Napoleon",
        avatar:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&f=y",
      },
      {
        id: "4",
        name: "DKMMM",
        avatar:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y",
      },
    ];

    const randomInfo = info[_.random(info.length - 1)];

    handleUpdateMessage({
      ...randomInfo,
      message: text,
    });
    setText("");
    inputRef.current?.focus();
  };

  const handleUpdateMessage = (newMessage: NewMessage) => {
    let lastMessage = _.last(messages);
    if (lastMessage?.id === newMessage.id) {
      setMessages([
        ...messages.slice(0, -1),
        { ...lastMessage, messages: [...lastMessage.messages, text] },
      ]);
    } else {
      setMessages([
        ...messages,
        {
          id: newMessage.id,
          name: newMessage.name,
          avatar: newMessage.avatar,
          messages: [newMessage.message],
        },
      ]);
    }
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
        <div>
          {messages.map((message) => {
            return message.id === "1" ? (
              <MyMessage messageInfo={message} />
            ) : (
              <OtherMessage messageInfo={message} />
            );
          })}
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
