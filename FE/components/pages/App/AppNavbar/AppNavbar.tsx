import { useRouter } from "next/dist/client/router";
import { IoCalendarClear } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import Tooltip from "../../../common/Tooltip/Tooltip";
import Logo from "../../../global/Logo/Logo";
import AccountMenu from "./AccountMenu";
import AppNavbarLink from "./AppNavbarLink";
import Link from "next/link";

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
        <div className="py-1">
          <Link href="/">
            <a>
              <Logo size={36} />
            </a>
          </Link>
        </div>
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
