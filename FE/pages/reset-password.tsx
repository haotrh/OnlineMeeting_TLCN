import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import urljoin from "url-join";
import * as yup from "yup";
import Button from "../components/common/Button/Button";
import Input from "../components/common/Input/Input";
import Logo from "../components/global/Logo/Logo";
import { config } from "../utils/config";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token;

  if (!token) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { token } };
};

const resetPasswordSchema = yup.object({
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

const ResetPassword = ({ token }: { token: string }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: any) => {
    if (isSubmitting) {
      return;
    }
    clearErrors();
    try {
      await axios.post(
        urljoin(config.backendUrl, "api/auth/reset-password"),
        { password: data.password },
        {
          params: {
            token,
          },
        }
      );
      setIsSuccess(true);
    } catch (error) {
      setError("general", {
        message:
          "Your reset link is expired after 10 minutes or you use the wrong link. Please try again!",
      });
      console.log(error);
    }
  };

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
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
            <div className="w-[400px] bg-white px-4 py-6 shadow-md rounded-md">
              <h1 className="text-center font-black text-darkblue-3 text-xl">
                Change password
              </h1>
              <div className="mt-8 space-y-4 font-medium font-poppins text-blue-800 text-sm">
                {errors?.general && (
                  <div className="text-red-500 whitespace-pre-wrap">
                    {errors?.general?.message}
                  </div>
                )}
                <div>
                  <label>New password</label>
                  <Input
                    {...register("password")}
                    type="password"
                    error={errors?.password?.message}
                    placeholder="Enter new password"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label>Confirm password</label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    error={errors?.confirmPassword?.message}
                    placeholder="Enter confirm password"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full mt-4 rounded-full py-3 font-semibold"
                >
                  Change password
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex-1">
            <div className="w-[400px] bg-white px-4 py-6 shadow-md rounded-md">
              <h1 className="text-center font-black text-darkblue-3 text-xl">
                Password changed!
              </h1>
              <div className="text-center px-6 mt-4 font-semibold text-sm text-gray-500">
                Your password has been changed successfully.
              </div>
              <div className="select-none">
                <img src="/success.png" alt="Email icon" />
              </div>
              <div className="space-y-3 flex flex-col mt-6">
                <Link href="/login">
                  <a>
                    <Button className="w-full font-semibold">
                      Go to login page
                    </Button>
                  </a>
                </Link>
                <Link href="/">
                  <a>
                    <Button base="light" className="w-full font-semibold">
                      Go to home
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
