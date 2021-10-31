import Button from "../../../common/Button/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Avatar from "../../../global/Avatar/Avatar";
import Input from "../../../common/Input/Input";
import TextArea from "../../../common/Textarea/Textarea";
import { MdEdit } from "react-icons/md";

const MyProfile = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      <h2 className="text-[22px] font-bold mb-6">My profile</h2>
      <div className="flex space-x-16">
        <div className="flex-shrink-0">
          <Avatar
            className="overflow-hidden rounded-full group cursor-pointer"
            size={120}
          >
            <div
              className="absolute inset-0 bg-gray-700 bg-opacity-70 opacity-0
             group-hover:opacity-100 transition-all flex-center text-white duration-300"
            >
              <MdEdit />
            </div>
          </Avatar>
        </div>
        <div className="flex-1 space-y-8">
          <div className="flex space-x-7">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-2">
                First name*
              </label>
              <Input placeholder="First name" defaultValue={user.firstName} />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-2">
                Last name*
              </label>
              <Input placeholder="Last name" defaultValue={user.lastName} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">
              Display name*
            </label>
            <Input placeholder="Last name" defaultValue={user.displayName} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">
              Tell us about yourself
            </label>
            <TextArea
              rows={6}
              placeholder="Type your bio here..."
              defaultValue={user.bio}
            />
          </div>
          <div>
            <Button className="w-[120px] font-semibold">Save</Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyProfile;
