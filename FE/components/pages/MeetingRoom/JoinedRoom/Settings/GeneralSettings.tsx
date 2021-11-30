import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import {
  setRoomAllowCamera,
  setRoomAllowChat,
  setRoomAllowMicrophone,
  setRoomAllowQuestion,
  setRoomAllowRaiseHand,
  setRoomAllowScreenshare,
} from "../../../../../lib/redux/slices/room.slice";
import Button from "../../../../common/Button/Button";
import Switch from "../../../../common/Switch/Switch";
import { RoomContext } from "../../../../contexts/RoomContext";

interface GeneralSettingsToggleOptionProps {
  onClick: () => any;
  name: string;
  active: boolean;
}

const GeneralSettingsToggleOption = ({
  onClick,
  name,
  active,
}: GeneralSettingsToggleOptionProps) => {
  const [loading, setLoading] = useState(false);
  const isHost = useAppSelector((selector) => selector.room.isHost);

  const handleClick = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await onClick();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium text-[15px]">{name}</div>
      </div>
      <div>
        <Switch
          onClick={handleClick}
          disabled={loading || !isHost}
          active={active}
        />
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const { socket } = useContext(RoomContext);
  const isHost = useAppSelector((selector) => selector.room.isHost);

  const {
    isPrivate,
    allowCamera,
    allowChat,
    allowMicrophone,
    allowScreenShare,
    allowRaiseHand,
    allowQuestion,
  } = useAppSelector((selector) => selector.room);

  const handleToggleScreenSharing = async () => {
    try {
      if (allowScreenShare) {
        await socket.request("host:turnOffScreenSharing");
      } else {
        await socket.request("host:turnOnScreenSharing");
      }
      // dispatch(setRoomAllowScreenshare(!allowScreenShare));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleChat = async () => {
    try {
      if (allowChat) {
        await socket.request("host:turnOffChat");
      } else {
        await socket.request("host:turnOnChat");
      }
      // dispatch(setRoomAllowChat(!allowChat));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleMicrophone = async () => {
    try {
      if (allowMicrophone) {
        await socket.request("host:turnOffMicrophone");
      } else {
        await socket.request("host:turnOnMicrophone");
      }
      // dispatch(setRoomAllowMicrophone(!allowMicrophone));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleCamera = async () => {
    try {
      if (allowCamera) {
        await socket.request("host:turnOffVideo");
      } else {
        await socket.request("host:turnOnVideo");
      }
      // dispatch(setRoomAllowCamera(!allowCamera));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleRaiseHand = async () => {
    try {
      if (allowRaiseHand) {
        await socket.request("host:turnOffRaiseHand");
      } else {
        await socket.request("host:turnOnRaiseHand");
      }
      // dispatch(setRoomAllowRaiseHand(!allowRaiseHand));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleQuestion = async () => {
    try {
      if (allowQuestion) {
        await socket.request("host:turnOffQuestion");
      } else {
        await socket.request("host:turnOnQuestion");
      }
      // dispatch(setRoomAllowQuestion(!allowQuestion));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePrivate = async () => {
    try {
      if (isPrivate) {
        await socket.request("host:turnOffPrivate");
      } else {
        await socket.request("host:turnOnPrivate");
      }
      // dispatch(setRoomAllowQuestion(!allowQuestion));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-2 px-6 space-y-4 select-none">
      {!isHost && <div>Host action only!</div>}
      <div className="p-3 bg-gray-200/40 shadow-md rounded-md -mx-2">
        <GeneralSettingsToggleOption
          name="Private mode:"
          onClick={handleTogglePrivate}
          active={isPrivate ?? false}
        />
        <div className="text-sm mt-2 text-gray-600">
          If using this mode, only guests and accepted participants can access
          the room. Others cannot send join request.
        </div>
      </div>
      <div className="text-[13px] mb-7 font-semibold text-blue-700">
        ALLOW PARTICIPANTS
      </div>
      <div className="space-y-4 text-gray-700 font-be">
        {/* Share screen */}
        <GeneralSettingsToggleOption
          name="Share their screen"
          onClick={handleToggleScreenSharing}
          active={allowScreenShare ?? false}
        />
        {/* Send chat */}
        <GeneralSettingsToggleOption
          name="Send chat messages"
          onClick={handleToggleChat}
          active={allowChat ?? false}
        />
        {/* Microphone */}
        <GeneralSettingsToggleOption
          name="Turn on their microphone"
          onClick={handleToggleMicrophone}
          active={allowMicrophone ?? false}
        />
        {/* Webcam */}
        <GeneralSettingsToggleOption
          name="Turn on their video"
          onClick={handleToggleCamera}
          active={allowCamera ?? false}
        />
        {/* Raise hand */}
        <GeneralSettingsToggleOption
          name="Raise their hand"
          onClick={handleToggleRaiseHand}
          active={allowRaiseHand ?? false}
        />
        {/* Question */}
        <GeneralSettingsToggleOption
          name="Ask any question"
          onClick={handleToggleQuestion}
          active={allowQuestion ?? false}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
