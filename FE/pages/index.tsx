import type { NextPage } from "next";
import { TextTyping } from "../components/common/TextTyping/TextTyping";
import { Navbar } from "../components/global/Navbar/Navbar";
import { Hero } from "../components/pages/Home/Hero";
import HomeProduct from "../components/pages/Home/HomeProduct";

const Home: NextPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="p-[80px]">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-3">
            One platform, endless potential
          </h3>
          <div className="max-w-3xl mx-auto text-lg font-medium">
            An all-in-one event management platform that makes planning,
            producing, and reliving event experiences easier than ever.
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
