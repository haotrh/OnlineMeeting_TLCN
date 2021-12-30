import classNames from "classnames";
import { ReactNode, useContext, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppSelector } from "../../../../../../hooks/redux";
import Popover from "../../../../../common/Popover/Popover";
import { RoomContext } from "../../../../../contexts/RoomContext";
import SendPrivateMessageModal from "../../PrivateMessageModal/SendPrivateMessageModal";

interface ParticipantOptionsButtonProps {
  onClick: () => any;
  disabled?: boolean;
  children?: ReactNode;
}

const ParticipantOptionsButton = ({
  disabled = false,
  onClick,
  children,
}: ParticipantOptionsButtonProps) => (
  <button
    onClick={onClick}
    className={classNames("px-3 py-1 w-full text-left font-semibold", {
      "hover:bg-gray-100 transition-colors": !disabled,
      "hover:cursor-default text-gray-400": disabled,
    })}
  >
    {children}
  </button>
);

export const ParticipantOptions = ({
  onPin,
  screen,
  isPinned,
  isScreenPinned,
  peer,
  isMe,
}: any) => {
  const [showMenu, setShowMenu] = useState(false);
  const [sendPrivateMessage, setSendPrivateMessage] = useState(false);

  const { unpinSpotlight, socket } = useContext(RoomContext);

  const meHost = useAppSelector((selector) => selector.me.info.isHost);

  const handleMute = async () => {
    try {
      await socket.request("host:mute", { peerId: peer.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopWebcam = async () => {
    try {
      await socket.request("host:stopVideo", { peerId: peer.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopScreenshare = async () => {
    try {
      await socket.request("host:stopScreenSharing", { peerId: peer.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLowerhand = async () => {
    try {
      await socket.request("host:lowerHand", { peerId: peer.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKick = async () => {
    try {
      await socket.request("host:kick", { peerId: peer.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendPrivateMessage = async () => {
    setSendPrivateMessage(true);
  };

  return (
    <Popover
      interactive={true}
      visible={showMenu}
      onClickOutside={() => setShowMenu(false)}
      placement="bottom"
      content={
        <div
          onClick={() => setShowMenu(false)}
          className="w-[180px] relative z-50 bg-white shadow-md border rounded-md py-2 text-sm text-gray-700"
        >
          {/* Pin participant */}
          <ParticipantOptionsButton
            onClick={() => (!isPinned ? onPin("peer") : unpinSpotlight())}
            disabled={false}
          >
            {!isPinned ? "Pin participant" : "Unpin participant"}
          </ParticipantOptionsButton>
          {/* Pin screen */}
          <ParticipantOptionsButton
            onClick={() => {
              isScreenPinned ? unpinSpotlight() : screen && onPin("screen");
            }}
            disabled={!screen}
          >
            {!isScreenPinned ? "Pin presentation" : "Unpin presentation"}
          </ParticipantOptionsButton>
          {/* Host */}
          {meHost && !isMe && (
            <>
              {/* Send private message */}
              <ParticipantOptionsButton onClick={handleSendPrivateMessage}>
                Send private message
              </ParticipantOptionsButton>
              <SendPrivateMessageModal
                isOpen={sendPrivateMessage}
                onClose={() => setSendPrivateMessage(false)}
                peerId={peer.id}
              />
              {/* Mute */}
              <ParticipantOptionsButton onClick={handleMute}>
                Mute
              </ParticipantOptionsButton>
              {/* Stop camera */}
              <ParticipantOptionsButton onClick={handleStopWebcam}>
                Stop camera
              </ParticipantOptionsButton>
              {/* Stop screenshare */}
              <ParticipantOptionsButton onClick={handleStopScreenshare}>
                Stop screenshare
              </ParticipantOptionsButton>
              {/* Lowerhand */}
              <ParticipantOptionsButton onClick={handleLowerhand}>
                Lowerhand
              </ParticipantOptionsButton>
              {/* Kick participant */}
              <ParticipantOptionsButton onClick={handleKick}>
                Kick participant
              </ParticipantOptionsButton>
            </>
          )}
        </div>
      }
    >
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-200/70 flex-center rounded-full transition-colors text-gray-500 z-0"
      >
        <BsThreeDotsVertical />
      </button>
    </Popover>
  );
};
