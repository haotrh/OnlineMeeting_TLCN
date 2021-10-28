import { NextPage } from "next";
import { AppLayout } from "../layouts/AppLayout";

const JoinPage: NextPage = () => {
  return (
    <AppLayout>
      <div className="min-h-[600px] pt-[80px] max-w-[360px] mx-auto">
        <h1 className="text-center text-[26px] font-medium">Join Meeting</h1>
        <div className="mt-8">
          <label className="block mb-3 text-sm font-medium text-gray-500">
            Meeting ID
          </label>
          <input
            className="border-2 focus:border-blue-500 transition-colors
            rounded-xl w-full py-2 px-4"
            placeholder="Enter meeting ID"
          />
        </div>
        <button className="w-full mt-5 bg-gray-200/70 rounded-xl p-2">
          Join
        </button>
      </div>
    </AppLayout>
  );
};

export default JoinPage;
