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
        <Switch onClick={handleClick} disabled={loading} active={active} />
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const { socket } = useContext(RoomContext);

  const {
    allowCamera,
    allowChat,
    allowMicrophone,
    allowScreenShare,
    allowRaiseHand,
    allowQuestion,
  } = useAppSelector((selector) => selector.room);

  const dispatch = useAppDispatch();

  const handleToggleScreenSharing = async () => {
    try {
      if (allowScreenShare) {
        await socket.request("host:turnOffScreenSharing");
      } else {
        await socket.request("host:turnOnScreenSharing");
      }
      dispatch(setRoomAllowScreenshare(!allowScreenShare));
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
      dispatch(setRoomAllowChat(!allowChat));
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
      dispatch(setRoomAllowMicrophone(!allowMicrophone));
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
      dispatch(setRoomAllowCamera(!allowCamera));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleRaisehand = async () => {
    try {
      if (allowRaiseHand) {
        await socket.request("host:turnOffRaisehand");
      } else {
        await socket.request("host:turnOnRaisehand");
      }
      dispatch(setRoomAllowRaiseHand(!allowRaiseHand));
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
      dispatch(setRoomAllowQuestion(!allowQuestion));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-2 px-6 space-y-4 select-none">
      <div className="text-[13px] mb-7 font-semibold text-gray-500">
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
          onClick={handleToggleRaisehand}
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
