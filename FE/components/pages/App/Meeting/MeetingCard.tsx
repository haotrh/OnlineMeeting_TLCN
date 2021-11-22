import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { BiLink } from "react-icons/bi";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import Button from "../../../common/Button/Button";
import Tooltip from "../../../common/Tooltip/Tooltip";
import Avatar from "../../../global/Avatar/Avatar";
import EditMeetingDrawer from "./EditMeetingDrawer";
import Link from "next/link";
import { Room } from "../../../../types/room.type";
import urljoin from "url-join";
import { toast } from "react-toastify";

interface MeetingCardProps {
  user: any;
  room: Room;
}

const MeetingCard = ({ user, room }: MeetingCardProps) => {
  const [edit, setEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <div>
        <div
          className="bg-white shadow-sm py-3 px-5 rounded-lg overflow-hidden
      flex space-x-4 relative group"
        >
          <div>
            <Avatar src={user?.profilePic} name={user?.firstName} />
          </div>
          <div>
            <div className="font-bold text-sm">{room.id}</div>
            <div className="text-[15px] font-medium">{room.name}</div>
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
            </Tooltip>
            <Tooltip content="Copy link">
              <div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      urljoin([
                        window.location.origin,
                        "meet",
                        room.id as string,
                      ])
                    );
                    setCopied(true);
                    toast("Link copied!");
                    setTimeout(() => setCopied(false), 300);
                  }}
                  className="w-10 h-10 flex-center text-lg !p-0 mr-2"
                  base="light-primary"
                  disabled={copied}
                >
                  <BiLink size={22} />
                </Button>
              </div>
            </Tooltip>
            <Link href={`/meet/${room.id}`}>
              <a target="_blank">
                <Button
                  className="h-10 flex items-center font-bold mr-2"
                  base="light-primary"
                >
                  Access Room <FiExternalLink className="ml-2" size={17} />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <EditMeetingDrawer
        room={room}
        isOpen={edit}
        onClose={() => setEdit(false)}
      />
    </>
  );
};

export default MeetingCard;
