import { useState } from "react";
import { BiLink } from "react-icons/bi";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import Button from "../../../common/Button/Button";
import Tooltip from "../../../common/Tooltip/Tooltip";
import Avatar from "../../../global/Avatar/Avatar";
import EditMeetingDrawer from "./EditMeetingDrawer";

interface MeetingCardProps {
  user: any;
  name: string;
  id: string;
}

const MeetingCard = ({ user, name, id }: MeetingCardProps) => {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className="px-2">
        <div
          className="bg-white shadow py-3 px-5 rounded-lg overflow-hidden
      flex space-x-4 relative group"
        >
          <div>
            <Avatar user={user} />
          </div>
          <div>
            <div className="font-bold text-sm">{id}</div>
            <div className="text-[15px] font-medium">{name}</div>
          </div>
          <div
            className="opacity-0 group-hover:opacity-100 transition-all duration-100 absolute top-0 right-0 h-full p-2
        items-center bg-white flex"
          >
            <div className="w-10 from-white/0 to-white bg-gradient-to-r h-full absolute right-full top-0" />
            <Tooltip content="Edit">
              <div>
                <Button
                  onClick={() => setEdit(true)}
                  className="w-10 h-10 flex-center text-lg !p-0 mr-2"
                  base="light-primary"
                >
                  <FiEdit />
                </Button>
              </div>
            </Tooltip>{" "}
            <Tooltip content="Copy link">
              <div>
                <Button
                  className="w-10 h-10 flex-center text-lg !p-0 mr-2"
                  base="light-primary"
                >
                  <BiLink size={22} />
                </Button>
              </div>
            </Tooltip>
            <Button
              className="h-10 flex items-center font-bold mr-2"
              base="light-primary"
            >
              Access Room <FiExternalLink className="ml-2" size={17} />
            </Button>
          </div>
        </div>
      </div>
      <EditMeetingDrawer isOpen={edit} onClose={() => setEdit(false)} />
    </>
  );
};

export default MeetingCard;
