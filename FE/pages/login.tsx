import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import Checkbox from "../components/common/Checkbox/Checkbox";
import FloatingInput from "../components/common/Input/FloatingInput";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: "/profile", permanent: false } };
  }
  return { props: { session } };
};

const Login: NextPage = () => {
  return (
    <div className="p-7 flex w-screen h-screen space-x-10">
      <div className="w-4/12 flex-shrink-0 p-10 pt-16">
        <div>
          <Link href="/">
            <a className="mb-4 block">LOGO</a>
          </Link>
          <div className="text-3xl font-black text-darkblue font-be">
            Hello,{" "}
            <span className="w-full inline-block mt-2">Welcome back</span>
          </div>
        </div>
        <div className="flex-1 mt-12 mb-6">
          <div className="space-y-10 text-sm text-gray-600 px-1">
            <FloatingInput placeholder="Email" />
            <FloatingInput placeholder="Password" type="password" />
          </div>
        </div>
        <div className="flex justify-between items-center mb-5 text-[13px] font-semibold text-indigo-700">
          <Checkbox placeholder="Remember me" id="remember-me" />
          <div>
            <Link href="/forgot-password">
              <a>Forgot password?</a>
            </Link>
          </div>
        </div>
        <div>
          <button
            className="w-full hover:bg-gradient-to-br transition-all shadow-md
            from-blue-500 via-indigo-500 to-purple-500 bg-gradient-to-r
            text-white font-semibold text-xl py-2 rounded-md mb-6"
          >
            LOGIN
          </button>
          <div className="text-center text-sm font-medium text-darkblue">
            Don&apos;t have an account?{" "}
            <Link href="/register">
              <a className="text-indigo-700 font-bold">Register</a>
            </Link>
          </div>
        </div>
        <div className="flex items-center my-8">
          <div className="flex-1 bg-gray-200 h-px"></div>
          <div className="text-sm font-semibold text-gray-600 mx-4">OR</div>
          <div className="flex-1 bg-gray-200 h-px"></div>
        </div>
        <div className="flex space-x-6 text-[13px] text-indigo-700">
          <button
            onClick={() => signIn("google")}
            className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center hover:bg-gray-50 transition-colors"
          >
            <img
              alt="Google"
              className="w-6 h-6 object-contain mr-3"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
            />
            Login with Google
          </button>
          <button
            onClick={() => signIn("facebook")}
            className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center hover:bg-gray-50 transition-colors"
          >
            <img
              alt="Facebook"
              className="w-6 h-6 object-contain mr-3"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
            />
            Login with Facebook
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

export default Login;
