import { useRouter } from "next/dist/client/router";
import { IoCalendarClear } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import Tooltip from "../../../common/Tooltip/Tooltip";
import AccountMenu from "./AccountMenu";
import AppNavbarLink from "./AppNavbarLink";

export const routes = [
  {
    href: "/app/meet",
    icon: IoCalendarClear,
    name: "Meeting",
  },
  {
    href: "/app/people",
    icon: MdPeople,
    name: "People",
  },
];

const AppNavbar = () => {
  const router = useRouter();

  return (
    <div className="w-16 border-r self-start flex flex-col justify-between items-center h-screen sticky top-0">
      <div className="pt-3 space-y-6">
        <img
          alt="logo"
          className="w-10 h-10 object-contain"
          src="https://us04st1.zoom.us/static/5.2.2682/image/new/ZoomLogo.png"
        />
        {routes.map((route, i) => (
          <Tooltip
            key={`appnavbar${(route.href, i)}`}
            placement="right"
            delay={[0, 0]}
            content={route.name}
          >
            <div>
              <AppNavbarLink
                href={route.href}
                active={router.pathname === route.href}
                icon={route.icon}
              />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="pb-6">
        <AccountMenu />
      </div>
    </div>
  );
};

export default AppNavbar;
