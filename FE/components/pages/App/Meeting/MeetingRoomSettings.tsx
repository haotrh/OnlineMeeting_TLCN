import { Controller, useFormContext } from "react-hook-form";
import Switch from "../../../common/Switch/Switch";
import { MeetingFormData } from "./MeetingDrawer";

interface SettingOptionProps {
  name: keyof MeetingFormData;
  label: string;
  readOnly: boolean;
}

const SettingOption = ({ name, label, readOnly }: SettingOptionProps) => {
  const { control } = useFormContext<MeetingFormData>();

  return (
    <div className="flex justify-between items-center">
      <div className="text-darkblue text-sm font-semibold">{label}</div>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Switch
            disabled={readOnly}
            circleSize={14}
            width={45}
            onClick={() => onChange(!value)}
            active={value as boolean}
          />
        )}
      />
    </div>
  );
};

const MeetingRoomSettings = ({ readOnly }: { readOnly: boolean }) => {
  return (
    <div>
      <label className="font-bold block mb-2">Room settings</label>
      <div className="space-y-2 mt-2.5">
        <SettingOption
          readOnly={readOnly}
          name="allowCamera"
          label="Allow to use camera"
        />
        <SettingOption
          readOnly={readOnly}
          name="allowMicrophone"
          label="Allow to use microphone"
        />
        <SettingOption
          readOnly={readOnly}
          name="allowScreenShare"
          label="Allow to share screen"
        />
        <SettingOption
          readOnly={readOnly}
          name="allowChat"
          label="Allow to send chat"
        />
        <SettingOption
          readOnly={readOnly}
          name="allowRaiseHand"
          label="Allow to raise hand"
        />
        <SettingOption
          readOnly={readOnly}
          name="allowQuestion"
          label="Allow to ask question"
        />
      </div>
    </div>
  );
};

export default MeetingRoomSettings;
