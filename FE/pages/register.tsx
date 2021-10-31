import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "../components/common/Button/Button";
import FloatingInput from "../components/common/Input/FloatingInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

  const onSubmit = async (userData: any) => {
    if (isSubmitting) {
      return;
    }
    clearErrors();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post("http://localhost:3001/api/auth/register", {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
      });
      await signIn("credentials", {
        email: userData.email,
        password: userData.password,
      });
    } catch (err: any) {
      console.log(err.response.data.message);
      setError("email", { message: err.response.data.message });
    }
  };

  return (
    <div className="p-7 flex w-screen h-screen space-x-10">
      <div className="flex-1">
        <img
          alt="background"
          className="w-full h-full object-contain"
          src="https://image.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[36%] flex-shrink-0 flex flex-col justify-between p-8"
      >
        <div>
          <Link href="/">
            <a className="mb-4 block">LOGO</a>
          </Link>
          <div className="text-3xl font-black text-gray-700 font-be">
            Register
          </div>
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
          <div className="flex space-x-6 text-[13px] font-poppins">
            <button
              type="button"
              className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center"
            >
              <img
                alt="Google logo"
                className="w-6 h-6 object-contain mr-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
              />
              Login with Google
            </button>
            <button
              type="button"
              className="flex-1 border p-2 rounded-md font-semibold flex justify-center items-center"
            >
              <img
                alt="Facebook logo"
                className="w-6 h-6 object-contain mr-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
              />
              Login with Facebook
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
