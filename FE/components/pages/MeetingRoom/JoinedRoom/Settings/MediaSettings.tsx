import _ from "lodash";
import { useContext, useState } from "react";
import { BiCamera, BiMicrophone } from "react-icons/bi";
import { useAppSelector } from "../../../../../hooks/redux";
import Button from "../../../../common/Button/Button";
import { Select } from "../../../../common/Select/Select";
import { RoomContext } from "../../../../contexts/RoomContext";

const MediaSettings = ({ onClose }: any) => {
  const [loading, setLoading] = useState(false);
  const { updateWebcam, updateMic } = useContext(RoomContext);

  const selectedAudioDevice = useAppSelector(
    (selector) => selector.settings.selectedAudioDevice
  );
  const selectedWebcam = useAppSelector(
    (selector) => selector.settings.selectedWebcam
  );

  const audioDevices = useAppSelector((selector) => selector.me.audioDevices);
  const cameras = useAppSelector((selector) => selector.me.cameras);

  const [newAudioDevice, setNewAudioDevice] = useState(null);
  const [newWebcam, setNewWebcam] = useState(null);

  const handleUpdate = async () => {
    setLoading(true);
    if (newAudioDevice && newAudioDevice !== selectedAudioDevice) {
      await updateMic({ restart: true, newDeviceId: newAudioDevice });
    }

    if (newWebcam && newWebcam !== selectedWebcam) {
      await updateWebcam({ restart: true, newDeviceId: newWebcam });
    }
    onClose();
  };

  return (
    <div className="py-2 px-6 space-y-4 font-poppins font-medium">
      <div className="relative z-40">
        <div className="text-sm text-blue-700 mb-3">Microphone</div>
        <div>
          <Select
            defaultValue={selectedAudioDevice}
            icon={BiMicrophone}
            className="p-2 border rounded-lg"
            placement="bottom-start"
            onChange={(value) => {
              setNewAudioDevice(value);
            }}
            options={audioDevices.map((audioDevice) => ({
              label: audioDevice.label,
              value: audioDevice.deviceId,
            }))}
          />
        </div>
      </div>
      <div className="relative z-30">
        <div className="text-sm text-blue-700 mb-3">Webcam</div>
        <div>
          <Select
            defaultValue={selectedWebcam}
            icon={BiCamera}
            className="p-2 border rounded-lg"
            placement="bottom-start"
            onChange={(value) => {
              setNewWebcam(value);
            }}
            options={cameras.map((camera) => ({
              label: camera.label,
              value: camera.deviceId,
            }))}
          />
        </div>
      </div>
      <div className="relative z-20">
        <Button
          disabled={loading}
          loading={loading}
          onClick={() => {
            handleUpdate();
          }}
          className="font-medium"
        >
          Update media settings
        </Button>
      </div>
    </div>
  );
};

export default MediaSettings;
