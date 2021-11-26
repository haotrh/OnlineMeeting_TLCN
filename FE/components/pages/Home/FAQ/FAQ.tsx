import React, { useState } from "react";
import FaqButton from "./FaqButton";
import FaqQuestion from "./FaqQuestion";

const Faq = () => {
  const [section, setSection] = useState<
    "general" | "transaction" | "payment" | "career"
  >("general");

  return (
    <div className="w-full mb-10">
      <h3 className="text-xl text-darkblue font-semibold mb-6">
        Have a <span className="text-blue-500">Question?</span> Look here
      </h3>
      <div className="flex space-x-20">
        <div className="w-[120px] flex-shrink-0 space-y-2">
          <div>
            <FaqButton
              onClick={() => setSection("general")}
              active={section === "general"}
            >
              General
            </FaqButton>
          </div>
          <div>
            <FaqButton
              onClick={() => setSection("transaction")}
              active={section === "transaction"}
            >
              Transaction
            </FaqButton>
          </div>
          <div>
            <FaqButton
              onClick={() => setSection("payment")}
              active={section === "payment"}
            >
              Payment
            </FaqButton>
          </div>
          <div>
            <FaqButton
              onClick={() => setSection("career")}
              active={section === "career"}
            >
              Career
            </FaqButton>
          </div>
        </div>
        <div className="flex-1 divide-y font-poppins text-[15px] -mt-2">
          {section === "general" && (
            <>
              <FaqQuestion question="Morbi tristique senectus et netus et malesuada fames ac turpis?" />
              <FaqQuestion
                question="Nec sagittis aliquam malesuada bibendum arcu vitae. Purus in massa
            tempor nec feugiat?"
              />
              <FaqQuestion
                question="Viverra nam libero justo laoreet. Auctor urna nunc id cursus
            metus. Id volutpat lacus laoreet non curabitur gravida arcu?"
              />
              <FaqQuestion question="Odio euismod lacinia at quis risus sed vulputate odio ut. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet?" />
            </>
          )}
          {section === "career" && (
            <>
              <FaqQuestion question="Semper auctor neque vitae tempus quam pellentesque?" />
              <FaqQuestion question="In dictum non consectetur a erat nam at lectus urna?" />
              <FaqQuestion question="Malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel?" />
              <FaqQuestion question="Posuere urna nec tincidunt praesent semper feugiat?" />
              <FaqQuestion question="Nisl suscipit adipiscing bibendum est ultricies?" />
            </>
          )}
          {section === "payment" && (
            <>
              <FaqQuestion question="Nec ultrices dui sapien eget mi proin. Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus?" />
              <FaqQuestion question="Mattis pellentesque id nibh tortor id aliquet lectus proin nibh. Mi proin sed libero enim sed faucibus turpis in?" />
              <FaqQuestion question="Nulla porttitor massa id neque aliquam vestibulum morbi. Eu consequat ac felis donec et?" />
            </>
          )}
          {section === "transaction" && (
            <>
              <FaqQuestion question="Dolor sit amet consectetur adipiscing. Lectus sit amet est placerat. Ornare lectus sit amet est?" />
              <FaqQuestion question="Morbi tristique senectus et netus et malesuada fames ac turpis?" />
              <FaqQuestion question="Turpis tincidunt id aliquet risus feugiat in. Leo duis ut diam quam nulla porttitor massa. Cursus vitae congue mauris rhoncus aenean vel?" />
              <FaqQuestion question="Convallis a cras semper auctor neque. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus?" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faq;
