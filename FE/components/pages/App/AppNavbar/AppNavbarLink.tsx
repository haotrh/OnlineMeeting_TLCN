import classNames from "classnames";
import Link from "next/link";
import { IconType } from "react-icons";

interface AppNavbarLinkProps {
  href: string;
  active?: boolean;
  icon: IconType;
}

const AppNavbarLink = ({ href, icon, active = false }: AppNavbarLinkProps) => {
  const Icon = icon;

  return (
    <Link href={href}>
      <a
        className={classNames(
          "w-10 h-10 flex-center rounded-lg text-lg transition-colors",
          {
            "bg-indigo-100/80 text-indigo-500": active,
            "text-gray-500 hover:bg-indigo-100/50 hover:text-indigo-600":
              !active,
          }
        )}
      >
        <Icon />
      </a>
    </Link>
  );
};

export default AppNavbarLink;
