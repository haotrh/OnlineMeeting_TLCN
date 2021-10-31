import Button from "../../../common/Button/Button";
import { AppDrawerProps } from "../AppDrawer/AppDrawer";
import MeetingDrawer from "./MeetingDrawer";

const NewMeetingDrawer = ({ title, onClose, ...props }: AppDrawerProps) => {
  return (
    <MeetingDrawer onClose={onClose} {...props} title="Create a meeting room">
      <div className="flex justify-end space-x-4">
        <Button onClick={onClose} base="light" className="font-semibold">
          Cancel
        </Button>
        <Button className="font-semibold">Create meeting room</Button>
      </div>
    </MeetingDrawer>
  );
};

export default NewMeetingDrawer;
