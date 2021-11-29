import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BiLink } from "react-icons/bi";
import { BsInfo, BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";
import urljoin from "url-join";
import { RoomData } from "../../../../types/room.type";
import Button from "../../../common/Button/Button";
import Tooltip from "../../../common/Tooltip/Tooltip";
import Avatar from "../../../global/Avatar/Avatar";
import EditMeetingDrawer from "./EditMeetingDrawer";

interface MeetingCardProps {
  room: RoomData;
}

const MeetingCard = ({ room }: MeetingCardProps) => {
  const user = useSession().data?.user;
  const isHost = useMemo(() => {
    return user?.id === room.host.id;
  }, []);

  const [edit, setEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <div>
        <div
          className="bg-white shadow-md hover:shadow-xl h-full
          transition-shadow py-3 px-5 rounded-lg overflow-hidden relative group"
        >
          <div className="flex space-x-2">
            <div className="mt-1">
              <Avatar
                size={36}
                src={room.host.profilePic}
                name={room.host.displayName}
              />
            </div>
            <div>
              <div className="font-bold text-[15px]">
                {room.host.displayName}
              </div>
              <div className="text-sm font-semibold text-gray-500 leading-3">
                <span className="text-[13px] font-medium">Room id:</span>{" "}
                <span>{room.id}</span>
              </div>
            </div>
            <div
              className="opacity-0 group-hover:opacity-100 transition-all duration-100 absolute top-0 right-0 p-2
        items-center bg-white flex"
            >
              <div className="w-10 from-white/0 to-white bg-gradient-to-r h-full absolute right-full top-0" />
              <Tooltip content={isHost ? "Edit" : "Info"}>
                <div>
                  <Button
                    onClick={() => setEdit(true)}
                    className="w-10 h-10 flex-center text-lg !p-0 mr-2"
                    base="light-primary"
                  >
                    {isHost ? <FiEdit /> : <BsInfoCircle size={22} />}
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
          <div className="mt-2">
            <div className="text-[17px] leading-6 mt-1 font-semibold">
              {room.name}
            </div>
            {/* <div>Guests</div>
            <div className="flex">
              {room.guests.map((guest) => (
                <div
                  key={`${room.id}guest${guest.id}`}
                  className="relative w-[22px]"
                >
                  <Avatar
                    size={32}
                    src={guest.profilePic}
                    name={guest.displayName}
                  />
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
      <EditMeetingDrawer
        readOnly={!isHost}
        room={room}
        isOpen={edit}
        onClose={() => setEdit(false)}
      />
    </>
  );
};

export default MeetingCard;
