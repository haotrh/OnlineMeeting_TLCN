import classNames from "classnames";
import { useSession } from "next-auth/react";

interface AvatarProps {
  size?: number;
  className?: string;
  children?: React.ReactNode;
  user?: any;
}

const Avatar = ({ className, user, children, size = 40 }: AvatarProps) => {
  const session = useSession();
  user = user ?? session.data?.user;

  return (
    <div
      className={classNames(className, "select-none relative")}
      style={{ width: size, height: size }}
    >
      {user?.profilePic ? (
        <img
          className="w-full h-full object-contain rounded-full"
          src={user.profilePic}
          alt="Avatar"
        />
      ) : (
        <div
          style={{ fontSize: size / 2.5 }}
          className="w-full h-full text-white bg-darkblue-3 rounded-full flex-center font-semibold"
        >
          {user?.firstName?.charAt(0)?.toUpperCase() +
            user?.lastName?.charAt(0)?.toUpperCase()}
        </div>
      )}
      {children}
    </div>
  );
};

export default Avatar;
