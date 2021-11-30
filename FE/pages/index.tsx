import React from "react";
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
        <Companies />
      </div>
    </PageLayout>
  );
};

export default React.memo(Home);
