import FeatureCard from "./FeatureCard";
import Slider from "react-slick";

const Features = () => {
  return (
    <>
      <div className="text-darkblue mt-10 mb-16 font-semibold text-2xl max-w-[300px] leading-9 text-center">
        Google Meet Features
      </div>
      <Slider
        dots={true}
        infinite={true}
        slidesToShow={3}
        slidesToScroll={2}
        className="w-full space-x-3 -m-3"
      >
        <FeatureCard
          title="Stay connected"
          description="Simple scheduling, easy recording, and adaptive layouts help
        people stay engaged and connected."
          color="green"
        />
        <FeatureCard
          title="Share your screen"
          description="Present documents, slides, and spreadsheets by showing your entire
          screen or just a window."
          color="red"
        />
        <FeatureCard
          title="Host large meetings"
          description="Invite up to 250 internal or external participants to a meeting."
          color="blue"
        />
        <FeatureCard
          title="Host large meetings"
          description="Invite up to 250 internal or external participants to a meeting."
          color="blue"
        />
        <FeatureCard
          title="Host large meetings"
          description="Invite up to 250 internal or external participants to a meeting."
          color="blue"
        />
        <FeatureCard
          title="Host large meetings"
          description="Invite up to 250 internal or external participants to a meeting."
          color="blue"
        />
      </Slider>
    </>
  );
};

export default Features;
