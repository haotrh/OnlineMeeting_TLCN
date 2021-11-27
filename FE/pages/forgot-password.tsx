import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsChevronLeft } from "react-icons/bs";
import urljoin from "url-join";
import * as yup from "yup";
import Button from "../components/common/Button/Button";
import Input from "../components/common/Input/Input";
import Logo from "../components/global/Logo/Logo";
import { config } from "../utils/config";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Invalid email address"),
});

const ForgotPassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema) });
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await axios.post(urljoin(config.backendUrl, "api/auth/forgot-password"), {
        email: data.email,
      });

      setIsSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isSent ? (
        <div className="flex w-screen h-screen space-x-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-5/12 flex-shrink-0 px-20 flex flex-col justify-between"
          >
            <div className="pt-10 flex-1">
              <Link href="/">
                <a className="mx-auto">
                  <Logo />
                </a>
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div>
                <div className="text-3xl font-black text-darkblue">
                  Forgot Your Password?
                </div>
                <div className="text-sm font-medium font-poppins pr-20 mt-5 text-gray-500">
                  Enter your registered email below to receive password reset
                  link
                </div>
              </div>
              <div className="mt-12 mb-5">
                <div className="text-sm text-gray-600">
                  <Input
                    {...register("email")}
                    error={errors?.email?.message}
                    className="bg-[#F6F8FA] py-3 font-be"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-indigo-700">
                <Link href="/login">
                  <a className="flex items-center text-sm">
                    <BsChevronLeft size={20} />
                    <div className="leading-[12px] font-semibold">Back</div>
                  </a>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  base="custom"
                  customBaseClassName="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                  className="px-9 text-sm font-poppins shadow-md text-white font-medium py-2 rounded-md"
                >
                  SEND
                </Button>
              </div>
            </div>
            <div className="flex-1" />
          </form>
          <div className="flex-1 bg-[#F7F6F9] flex-center select-none">
            <img
              alt="background"
              className="w-[80%]"
              src="/forgot-password.png"
            />
          </div>
        </div>
      ) : (
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
                  Email has been sent!
                </h1>
                <div className="text-center px-3 mt-4 font-semibold text-sm text-gray-500">
                  Check your inbox for the next steps. If you don&apos;t receive
                  an email, and it&apos;s not in your spam folder this could
                  mean you signed up with a different address.
                </div>
                <div className="select-none">
                  <img src="/email-sent.png" alt="Email icon" />
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
      )}
    </>
  );
};

export default ForgotPassword;
