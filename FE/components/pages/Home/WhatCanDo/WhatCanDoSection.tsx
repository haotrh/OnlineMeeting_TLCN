import classNames from "classnames";

interface WhatCanDoSectionProps {
  title: string;
  description: string;
  textSide?: "left" | "right";
  image: string;
}

const WhatCanDoSection = ({
  title,
  description,
  textSide,
  image,
}: WhatCanDoSectionProps) => {
  return (
    <div
      className={classNames("flex space-x-20", {
        "space-x-reverse flex-row-reverse": textSide === "right",
      })}
    >
      <div className="flex-1 py-4">
        <h4 className="text-darkblue font-bold text-[22px] mb-6">{title}</h4>
        <div className="text-[17px] text-gray-600 font-semibold leading-[26px] whitespace-pre-line">
          {description}
        </div>
      </div>
      <div className="flex-1 flex-shrink-0">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default WhatCanDoSection;
