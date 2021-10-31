import React from "react";
import Button from "../components/common/Button/Button";
import Companies from "../components/pages/Home/Companies/Companies";
import Features from "../components/pages/Home/Features/Features";
import Hero from "../components/pages/Home/Hero/Hero";
import WhatCanDo from "../components/pages/Home/WhatCanDo/WhatCanDo";
import { PageLayout } from "../layouts/PageLayout";

const Home = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center mt-16">
        <Hero />
        <Features />
        <WhatCanDo />
        <div className="w-full mb-10">
          <h3 className="text-xl text-darkblue font-semibold mb-6">
            Have a <span className="text-blue-500">Question?</span> Look here
          </h3>
          <div className="flex space-x-20">
            <div className="w-[120px] flex-shrink-0 space-y-2">
              <div>
                <button className="w-full text-sm font-medium p-2 bg-blue-500 text-white rounded-md">
                  General
                </button>
              </div>
              <div>
                <button className="text-gray-400 text-sm font-medium p-2 w-full">
                  Transaction
                </button>
              </div>
              <div>
                <Button base="light-primary" className="w-full text-blue-500">
                  asdasd
                </Button>
                <button className="text-gray-400 text-sm font-medium p-2 w-full">
                  Payment
                </button>
              </div>
              <div>
                <button className="text-gray-400 text-sm font-medium p-2 w-full">
                  Career
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black"></div>
          </div>
        </div>
        <Companies />
      </div>
    </PageLayout>
  );
};

export default React.memo(Home);
