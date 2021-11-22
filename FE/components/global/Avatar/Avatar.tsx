import classNames from "classnames";
import { useSession } from "next-auth/react";

interface AvatarProps {
  size?: number;
  className?: string;
  children?: React.ReactNode;
  src?: string;
  name?: string;
}

const Avatar = ({ className, src, name, children, size = 40 }: AvatarProps) => {
  return (
    <div
      className={classNames(className, "select-none relative")}
      style={{ width: size, height: size }}
    >
      {src && (
        <img
          className="w-full h-full object-contain rounded-full"
          src={src}
          alt="Avatar"
        />
      )}
      {!src && name && (
        <div
          style={{ fontSize: size / 2.5 }}
          className="w-full h-full text-white bg-darkblue-3 rounded-full flex-center font-semibold"
        >
          {name.substring(0, 1).toLocaleUpperCase()}
        </div>
      )}
      {children}
    </div>
  );
};

export default Avatar;
