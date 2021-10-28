import { NextPage } from "next";
import Link from "next/link";
import Checkbox from "../components/common/Checkbox/Checkbox";
import FloatingInput from "../components/common/Input/FloatingInput";
import Input from "../components/common/Input/Input";

const ForgotPassword: NextPage = () => {
  return (
    <div className="p-7 flex w-screen h-screen space-x-10">
      <div className="w-4/12 flex-shrink-0 p-10 flex flex-col justify-center">
        <div>
          <Link href="/">
            <a className="mb-4 block">LOGO</a>
          </Link>
          <div className="text-3xl font-black text-darkblue font-be">
            Forgot{" "}
            <span className="w-full inline-block mt-2">Your Password?</span>
          </div>
        </div>
        <div className="mt-12 mb-6">
          <div className="space-y-10 text-sm text-gray-600 px-1">
            <Input placeholder="Email" />
          </div>
        </div>
        <div>
          <button
            className="w-full font-poppins shadow-md from-blue-500 via-indigo-500 to-purple-500
            bg-gradient-to-r text-white font-semibold text-lg py-2 rounded-md mb-6"
          >
            RESET PASSWORD
          </button>
        </div>
      </div>
      <div className="flex-1">
        <img
          className="w-full h-full object-contain"
          src="https://image.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
