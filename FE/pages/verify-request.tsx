import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import urljoin from "url-join";
import Button from "../components/common/Button/Button";
import Logo from "../components/global/Logo/Logo";
import { config } from "../utils/config";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: true } };
  }
  return { props: { email: session.user.email } };
};

const VerifyRequest = ({ email }: { email: string }) => {
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await axios.post(
        urljoin(config.backendUrl, "api/auth/send-verification-email"),
        { email }
      );
      setIsSent(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="w-screen min-h-screen flex-center flex-col bg-[#F8F9FD]">
        <div className="relative">
          <div
            className="absolute bg-[#F8F9FD] flex-center w-20 h-20 border border-l-transparent border-b-transparent
            rotate-[135deg] rounded-full -translate-y-1/2 left-1/2 -translate-x-1/2"
          >
            <Link href="/">
              <a className="rotate-[-135deg] select-none">
                <Logo size={48} />
              </a>
            </Link>
          </div>
          <div className="w-[500px] bg-white px-4 pt-16 pb-8 shadow-xl rounded-md border">
            <h1 className="text-center font-black text-darkblue-3 text-xl">
              Your account has not been verified yet.
            </h1>
            <div className="text-center px-3 mt-4 font-semibold text-sm text-gray-500">
              Please check your email for the verification link. If you
              don&apos;t see it, you may need to check your spam folder.
            </div>
            <div className="text-center px-3 mt-4 font-semibold text-sm text-red-500">
              If you have already verified your account, try to logout and login
              again.
            </div>
            <div className="select-none">
              <img src="/box-error.png" alt="Error" />
            </div>
            <div className="text-center mt-4 font-semibold text-sm text-gray-500 mb-2">
              Still can&apos;t find the email?
            </div>
            <div>
              <Button
                loading={loading}
                disabled={isSent || loading}
                onClick={handleResendEmail}
                className="mx-auto block font-semibold px-8"
              >
                {isSent ? "Email sent" : "Resend email"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyRequest;
