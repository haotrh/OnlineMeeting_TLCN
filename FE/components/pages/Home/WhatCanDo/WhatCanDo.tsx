import WhatCanDoSection from "./WhatCanDoSection";

const WhatCanDo = () => {
  return (
    <>
      <div className="text-darkblue mt-10 mb-16 font-semibold text-2xl max-w-[300px] leading-9 text-center">
        What you can do with OMeeting
      </div>
      <div className="w-full space-y-16 font-quicksand mb-20">
        <WhatCanDoSection
          title="Meet safely"
          description="OMeeting uses the same protections that OMeeting uses to secure your information
          and safeguard your privacy. OMeeting video conferences are encrypted in
          transit, and our array of safety measures are continuously updated for added protection."
          textSide="left"
          image="https://lh3.googleusercontent.com/wWRj5_4RG20mJL92Wn0VZIoVkZeegmLOc0658HDCCWq2wgFqCb0D03UoNDnIwRWT6MG3kV1HhZ908uiwquFBnv7OX3CNaX1OHjTmg-rkQ2u7qFb3H64=rwu-v1-w1400"
        />
        <WhatCanDoSection
          title="Meet from anywhere"
          description={`Get the whole crew together in OMeeting, where you can present business proposals, collaborate on chemistry assignments, or just catch up face to face.\n
          Businesses, schools, and other organizations can live stream meetings to 100,000 viewers within their domain.`}
          textSide="right"
          image="https://lh3.googleusercontent.com/nSljuMFCI1FTxwxfrvh4BpAes486Ucy-HMSeo_1xiK5UO3Kty40OMFwrAiFM6-2At7gNtATmwLCjzSxRCGrGpu_ojkwcdiIFwwOdqk1w4h4P3O8Hmnsl=rwu-v1-w1400"
        />
        <WhatCanDoSection
          title="Meet on any device"
          description="Invited guests can join an online video conference from their
          computer using any modern web browser—no software to install. On
          mobile devices, they can join from the OMeeting app."
          textSide="left"
          image="https://lh3.googleusercontent.com/lGwMMxMMKux5VLCMcjoWS_0iTS0it5F-2NfsXSMFIJiuoDQe1HnBDUngl7n_TRfaXjvbYeExEYNqb6p55GcmSKLQx3OiiAETZPlDfpZ7d7pn1Iz8obU=rwu-v1-w1400"
        />
        <WhatCanDoSection
          title="Meet clearly"
          description="OMeeting adjusts to your network speed, ensuring high quality
          video calls wherever you are. New AI enhancements keep your
          calls clear even when your surroundings aren’t."
          textSide="right"
          image="https://lh3.googleusercontent.com/v6YCODdVNqrT8PpLahM2_MH5Cgf97h0nTXEuhH6ag-Er-UobfS4VeQ1fY2J6EuDi3LxHZq1QszCdOybFA41xrBPmWatOtazJpSKqknjZRl0DZhyhmg=rwu-v1-w1400"
        />
      </div>
    </>
  );
};

export default WhatCanDo;
