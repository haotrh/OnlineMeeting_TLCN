import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "../components/common/Button/Button";
import FloatingInput from "../components/common/Input/FloatingInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoginWithFacebookButton from "../components/pages/Auth/LoginWithFacebookButton";
import LoginWithGoogleButton from "../components/pages/Auth/LoginWithGoogleButton";
import Logo from "../components/global/Logo/Logo";
import urljoin from "url-join";
import { config } from "../utils/config";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: "/app", permanent: false } };
  }
  return { props: { session } };
};

const registerSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Invalid email address"),
  firstName: yup
    .string()
    .required("Please enter your first name")
    .min(2, "The minium length is 2 characters"),
  lastName: yup
    .string()
    .required("Please enter your last name")
    .min(2, "The minium length is 2 characters"),
  password: yup
    .string()
    .required("Please enter your password")
    .min(6, "The minium length is 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please enter your confirm password")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (userData: any) => {
    if (isSubmitting) {
      return;
    }
    clearErrors();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post(urljoin(config.backendUrl, "api/auth/register"), {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.log(err.response.data.message);
      setError("email", { message: err.response.data.message });
    }
  };

  return (
    <div className="flex w-screen h-screen space-x-10">
      <div className="flex-1 bg-[#F7F6F9] flex-center">
        <img
          alt="background"
          className="w-[90%] object-contain"
          src="/register.png"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-5/12 flex-shrink-0 flex flex-col justify-between p-20"
      >
        <div>
          <Link href="/">
            <a className="mb-4 block">
              <Logo />
            </a>
          </Link>
        </div>
        {!isSuccess ? (
          <div>
            <div className="text-3xl font-black text-gray-700 font-be">
              Register
            </div>
            <div className="my-8 space-y-8 text-sm">
              <div className="flex space-x-5">
                <div className="flex-1">
                  <FloatingInput
                    error={errors?.firstName?.message}
                    {...register("firstName")}
                    placeholder="Firstname"
                  />
                </div>
                <div className="flex-1">
                  <FloatingInput
                    error={errors?.lastName?.message}
                    {...register("lastName")}
                    placeholder="Lastname"
                  />
                </div>
              </div>
              <FloatingInput
                {...register("email")}
                error={errors?.email?.message}
                placeholder="Email"
              />
              <FloatingInput
                {...register("password")}
                error={errors?.password?.message}
                placeholder="Password"
                type="password"
              />
              <FloatingInput
                {...register("confirmPassword")}
                error={errors?.confirmPassword?.message}
                placeholder="Confirm password"
                type="password"
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                base="custom"
                customBaseClassName="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 text-white"
                className="flex-center w-full font-semibold text-xl py-3 rounded-xl mb-4 font-poppins"
              >
                Register
              </Button>
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
              <div className="flex space-x-6">
                <LoginWithGoogleButton />
                <LoginWithFacebookButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 mt-10">
            <div className="text-3xl font-black text-gray-700 font-be text-center">
              Registered successfully!
            </div>
            <div className="text-center mt-3 font-medium font-poppins text-sm text-gray-600">
              Please check your email to verify your account. In order to start
              using our services, you need to confirm your email address.
            </div>
            <div className="select-none">
              <img src="/success.png" alt="Email icon" />
            </div>
            <Link href="/login">
              <a className="flex-center">
                <Button
                  base="light-primary"
                  className="w-full font-semibold text-[15px] max-w-[320px]"
                >
                  Click here to login
                </Button>
              </a>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
