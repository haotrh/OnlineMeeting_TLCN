import Button from "../../../common/Button/Button";
import { AppDrawerProps } from "../AppDrawer/AppDrawer";
import MeetingDrawer from "./MeetingDrawer";

const EditMeetingDrawer = ({ title, onClose, ...props }: AppDrawerProps) => {
  return (
    <MeetingDrawer onClose={onClose} {...props} title="Edit meeting room">
      <div className="flex justify-end space-x-4">
        <Button onClick={onClose} base="light" className="font-semibold">
          Cancel
        </Button>
        <Button className="font-semibold">Edit meeting room</Button>
      </div>
      <hr />
      <div className="flex justify-end">
        <Button base="danger" className="font-semibold">Delete meeting room</Button>
      </div>
    </MeetingDrawer>
  );
};

export default EditMeetingDrawer;
