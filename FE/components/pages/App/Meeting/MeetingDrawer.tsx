import Input from "../../../common/Input/Input";
import AppDrawer, { AppDrawerProps } from "../AppDrawer/AppDrawer";

const MeetingDrawer = ({ children, ...props }: AppDrawerProps) => {
  return (
    <AppDrawer {...props}>
      <div className="space-y-6 text-gray-700">
        <div>
          <label className="font-semibold block mb-2 text-sm">Name*</label>
          <Input placeholder="My meeting room name" />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-sm">Guests</label>
          <Input placeholder="My meeting room name" />
        </div>
        {children}
      </div>
    </AppDrawer>
  );
};

export default MeetingDrawer;
