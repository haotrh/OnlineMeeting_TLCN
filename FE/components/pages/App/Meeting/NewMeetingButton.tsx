import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import MeetingDrawer from "./MeetingDrawer";
import NewMeetingDrawer from "./NewMeetingDrawer";

const NewMeetingButton = () => {
  const [newMeeting, setNewMeeting] = useState(false);

  return (
    <>
      <div className="px-2">
        <div
          onClick={() => setNewMeeting(true)}
          className="border hover:border-blue-400 transition-colors select-none
    border-gray-300 hover:text-blue-500 border-dashed rounded-lg
    cursor-pointer flex-center flex-col h-full text-gray-400"
        >
          <div>
            <FiPlus size={20} />
          </div>
          <div className="font-bold text-sm">New meeting</div>
        </div>
      </div>
      <NewMeetingDrawer
        isOpen={newMeeting}
        onClose={() => setNewMeeting(false)}
      />
    </>
  );
};

export default NewMeetingButton;
