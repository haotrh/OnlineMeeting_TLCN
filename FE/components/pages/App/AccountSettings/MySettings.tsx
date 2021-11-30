import Button from "../../../common/Button/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Input from "../../../common/Input/Input";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { changePassword } from "../../../../lib/serverApi/user.api";
import { toast } from "react-toastify";
import { hideEmail } from "../../../../utils/hideEmail";
import DeleteAccoutModal from "./DeleteAccoutModal";

const changePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Please enter your old password")
    .min(6, "Password length must be greater than 6 characters"),
  newPassword: yup
    .string()
    .required("Please enter your new password")
    .min(6, "Password length must be greater than 6 characters"),
});

const MySettings = () => {
  const session = useSession();
  const user = session.data?.user;

  const [deleteModal, setDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onChangePassword = async (data: any) => {
    try {
      clearErrors();
      await changePassword(user?.id ?? "", data);
      toast("Password changed!");
    } catch (error: any) {
      setError("general", {
        message: error?.response?.data?.message ?? "",
      });
    }
  };

  return (
    <>
      <DeleteAccoutModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
      />
      <h2 className="text-[22px] font-bold mb-6">My settings</h2>
      <div>
        <h3 className="font-bold text-[16px] mb-3">Email address</h3>
        <div className="flex justify-between items-center">
          <div>
            Your email address is{" "}
            <span className="font-bold">{user?.email}</span>
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
        <form onSubmit={handleSubmit(onChangePassword)}>
          {errors?.general && (
            <div className="text-red-500 font-semibold text-sm mb-2">
              {errors.general.message}
            </div>
          )}
          <div className="flex justify-between space-x-8 mb-5">
            <div className="flex-1">
              <label className="text-sm font-semibold mb-2 block">
                New password
              </label>
              <Input
                {...register("newPassword")}
                error={errors?.newPassword?.message}
                placeholder="Enter your new password"
                type={showPassword ? "text" : "password"}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold mb-2 block">
                Current password
              </label>
              <Input
                {...register("oldPassword")}
                error={errors?.oldPassword?.message}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="font-semibold w-[140px]"
            >
              Save password
            </Button>
          </div>
        </form>
        <hr className="my-6" />
        <div>
          <h3 className="font-bold text-[16px] mb-3">Delete account</h3>
          <div>
            <Button
              onClick={() => setDeleteModal(true)}
              base="danger-outline"
              className="font-semibold w-[170px]"
            >
              Delete my account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MySettings;
