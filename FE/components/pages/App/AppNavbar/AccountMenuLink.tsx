import { IconType } from "react-icons/lib";
import Link from "next/link";
import classNames from "classnames";

interface AccountMenuLinkProps {
  href: string;
  icon: IconType;
  name: string;
  active: boolean;
}

const AccountMenuLink = ({
  href,
  active,
  icon,
  name,
}: AccountMenuLinkProps) => {
  const Icon = icon;

  return (
    <Link href={href}>
      <a
        className={classNames(
          "rounded-md flex items-center p-2 font-semibold",
          {
            "bg-indigo-100/50 text-indigo-500": active,
            "hover:bg-indigo-100/50 hover:text-indigo-500 transition-colors duration-100":
              !active,
          }
        )}
      >
        <Icon className="mr-2 text-lg" /> {name}
      </a>
    </Link>
  );
};

export default AccountMenuLink;
