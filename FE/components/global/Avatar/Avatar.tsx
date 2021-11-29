import classNames from "classnames";

interface AvatarProps {
  size?: number;
  className?: string;
  children?: React.ReactNode;
  src?: string;
  name?: string;
  imgClassName?: string;
}

const Avatar = ({
  className,
  imgClassName,
  src,
  name,
  children,
  size = 40,
}: AvatarProps) => {
  return (
    <div
      className={classNames(className, "select-none relative")}
      style={{ width: size, height: size }}
    >
      {src && (
        <img
          className={classNames(
            "w-full h-full object-contain rounded-full",
            imgClassName
          )}
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
