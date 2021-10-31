import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import Popover from "../../../common/Popover/Popover";
import Avatar from "../../../global/Avatar/Avatar";
import AccountMenuLink from "./AccountMenuLink";

export const routes = [
  {
    href: "/app/settings",
    icon: AiOutlineSetting,
    name: "Account settings",
  },
];

const AccountMenu = () => {
  const session = useSession();
  const user = session.data?.user;

  const router = useRouter();

  const [toggle, setToggle] = useState(false);

  return (
    <Popover
      interactive={true}
      visible={toggle}
      onClickOutside={() => setToggle(false)}
      placement="right-end"
      offset={[-3, 5]}
      content={
        <div
          onClick={() => setToggle(false)}
          className="py-2.5 px-3 text-[15px] font-medium w-[240px] p-2 shadow-md rounded-xl bg-white"
        >
          <div>
            <div>
              {routes.map((route, i) => (
                <AccountMenuLink
                  href={route.href}
                  key={`accountmenu${(route.href, i)}`}
                  icon={route.icon}
                  name={route.name}
                  active={router.pathname === route.href}
                />
              ))}
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between p-1">
              <div>
                <div className="font-bold">{user?.displayName}</div>
                <div>{user?.email}</div>
              </div>
              <div className="">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-blue-500 transition-colors p-2 text-lg"
                >
                  <FiLogOut />
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div
        className="cursor-pointer relative"
        onClick={() => setToggle(!toggle)}
      >
        <Avatar />
        <div className="absolute p-0.5 bg-white flex-center bottom-0 right-0 rounded-full">
          <AiOutlineSetting size={13} />
        </div>
      </div>
    </Popover>
  );
};

export default AccountMenu;
