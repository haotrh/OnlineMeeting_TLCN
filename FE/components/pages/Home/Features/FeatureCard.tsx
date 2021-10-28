import classNames from "classnames";

type FeatureCardColor = "green" | "red" | "blue";

interface FeatureCardProps {
  title: string;
  description: string;
  color: FeatureCardColor;
}

const FeatureCard = ({ title, description, color }: FeatureCardProps) => {
  return (
    <div className="p-4">
      <div
        className={classNames("py-4 px-8 rounded-lg", {
          "bg-[#F1FDF7]": color === "green",
          "bg-[#FFF6F6]": color === "red",
          "bg-[#F6F4FE]": color === "blue",
        })}
      >
        <div
          className={classNames("font-semibold mb-2 text-[17px]", {
            "text-green-500": color === "green",
            "text-red-500": color === "red",
            "text-blue-500": color === "blue",
          })}
        >
          {title}
        </div>
        <div className="text-sm leading-6 text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export default FeatureCard;
