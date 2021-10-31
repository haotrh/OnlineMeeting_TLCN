import Button from "../../../common/Button/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Input from "../../../common/Input/Input";
import { useState } from "react";

const MySettings = () => {
  const session = useSession();
  const user = session.data?.user;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2 className="text-[22px] font-bold mb-6">My settings</h2>
      <div>
        <h3 className="font-bold text-[16px] mb-3">Email address</h3>
        <div className="flex justify-between items-center">
          <div>
            Your email address is{" "}
            <span className="font-bold">{user?.email}</span>
          </div>
          <div>
            <button className="text-blue-700 font-semibold text-sm underline">
              Change
            </button>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[16px] mb-3">Password</h3>
          <div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-blue-700 font-semibold text-sm underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-8 mb-5">
          <div className="flex-grow flex-shrink-0">
            <label className="text-sm font-semibold mb-2 block">
              New password
            </label>
            <Input
              placeholder="Enter your new password"
              type={showPassword ? "text" : "password"}
            />
          </div>
          <div className="flex-grow flex-shrink-0">
            <label className="text-sm font-semibold mb-2 block">
              Current password
            </label>
            <Input
              placeholder="Enter your current password"
              type={showPassword ? "text" : "password"}
            />
          </div>
        </div>
        <div className="font-semibold text-sm">
          Can{"'"}t remember your current password?{" "}
          <Link href="/forgot-password">
            <a target="_blank" className="text-blue-700 font-bold underline">
              Reset your password
            </a>
          </Link>
        </div>
        <div className="my-3">
          <Button className="font-semibold w-[140px]">Save password</Button>
        </div>
        <hr className="my-6" />
        <div>
          <h3 className="font-bold text-[16px] mb-3">Delete account</h3>
          <div></div>
          <div>
            <Button base="danger-outline" className="font-semibold w-[170px]">
              Delete my account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MySettings;
