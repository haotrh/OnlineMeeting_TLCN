import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Button from "../../../common/Button/Button";
import NewMeetingDrawer from "./NewMeetingDrawer";

const NewMeetingButton = () => {
  const [newMeeting, setNewMeeting] = useState(false);

  return (
    <>
      <div className="px-2">
        <Button onClick={() => setNewMeeting(true)} className="flex items-center !p-3">
          <FiPlus className="mr-1.5" size={16} />
          <div className="font-bold text-sm">New meeting</div>
        </Button>
      </div>
      <NewMeetingDrawer
        isOpen={newMeeting}
        onClose={() => setNewMeeting(false)}
      />
    </>
  );
};

export default NewMeetingButton;
