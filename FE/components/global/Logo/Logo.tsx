const Logo = ({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <img
      alt="Logo"
      style={{ width: size, height: size }}
      className={className}
      src="/logo.png"
    />
  );
};

export default Logo;
