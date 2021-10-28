import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import FloatingInput from "../components/common/Input/FloatingInput";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: "/profile", permanent: false } };
  }
  return { props: { session } };
};

const Register: NextPage = () => {
  return (
    <div className="p-7 flex w-screen h-screen space-x-10">
      <div className="flex-1">
        <img
          className="w-full h-full object-contain"
          src="https://image.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg"
        />
      </div>
      <div className="w-4/12 flex-shrink-0 flex flex-col justify-between p-8">
        <div>
          <Link href="/">
            <a className="mb-4 block">LOGO</a>
          </Link>
          <div className="text-3xl font-black text-gray-700 font-be">
            Register
          </div>
        </div>
        <div className="my-8 space-y-10 text-sm">
          <div className="flex space-x-5">
            <div className="flex-1">
              <FloatingInput placeholder="Firstname" />
            </div>
            <div className="flex-1">
              <FloatingInput placeholder="Lastname" />
            </div>
          </div>
          <FloatingInput placeholder="Email" />
          <FloatingInput placeholder="Password" type="password" />
          <FloatingInput placeholder="Confirm password" type="password" />
        </div>
        <div>
          <button
            className="w-full bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 text-white font-semibold
          text-xl py-3 rounded-xl mb-4 font-poppins"
          >
            REGISTER
          </button>
          <div className="text-center text-sm font-medium text-darkblue">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-blue-700 font-bold">Login</a>
            </Link>
          </div>
        </div>
        <div className="flex items-center my-7">
          <div className="flex-1 bg-gray-200 h-px"></div>
          <div className="font-poppins text-sm font-semibold text-gray-600 mx-4">
            OR
          </div>
          <div className="flex-1 bg-gray-200 h-px"></div>
        </div>
        <div className="flex-1">
          <div className="flex space-x-6 text-[13px] font-poppins">
            <button className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center">
              <img
                className="w-6 h-6 object-contain mr-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
              />
              Login with Google
            </button>
            <button className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center">
              <img
                className="w-6 h-6 object-contain mr-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
              />
              Login with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
