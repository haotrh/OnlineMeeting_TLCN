import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import urljoin from "url-join";
import Logo from "../components/global/Logo/Logo";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token;

  if (!token) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  try {
    await axios.post(
      urljoin(process.env.BACKEND_URL as string, "/api/auth/verify-email"),
      null,
      {
        params: {
          token: token as string,
        },
      }
    );
    return { props: { verified: true } };
  } catch (error: any) {
    console.log(error?.message);
    return { props: { verified: false } };
  }
};

const VerifyEmail = ({ verified }: { verified: string }) => {
  return (
    <>
      <div className="w-screen min-h-screen flex-center flex-col bg-[#F8F9FD]">
        <div className="my-12">
          <Link href="/">
            <a>
              <Logo size={64} />
            </a>
          </Link>
        </div>
        <div className="flex-1">
          <div className="w-[400px] bg-white px-4 py-6 shadow-md rounded-md">
            <h1 className="text-center font-black text-darkblue-3 text-xl">
              {verified ? "Verify success!" : "Verify fail!"}
            </h1>
            <div className="text-center px-3 mt-4 font-semibold text-sm text-gray-500">
              {verified
                ? "Congratulations, you have successfully verified the email."
                : " Sorry! Maybe your link is expired after 10 minutes or you use the wrong link. Please try again!"}
            </div>
            <div className="select-none">
              {verified ? (
                <img src="/email-success.png" alt="Email icon" />
              ) : (
                <img src="/sad-face.png" alt="Email icon" />
              )}
            </div>
            <div className="px-4">
              <Link href="/">
                <a className="w-full rounded-full py-2 text-center text-white font-semibold bg-blue-600 block mt-4">
                  Go to home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
