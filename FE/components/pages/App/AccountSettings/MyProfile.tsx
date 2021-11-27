import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import * as yup from "yup";
import { updateUser } from "../../../../api/user.api";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import TextArea from "../../../common/Textarea/Textarea";
import Avatar from "../../../global/Avatar/Avatar";

const profileSchema = yup.object({
  firstName: yup.string().trim().required("Please enter your first name"),
  lastName: yup.string().trim().required("Please enter your last name"),
  displayName: yup.string().trim().required("Please enter your display name"),
});

interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
}

const MyProfile = () => {
  const session = useSession();
  const user = session.data?.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Profile>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      displayName: user?.displayName ?? "",
    },
  });

  const onSubmit = async (data: Profile) => {
    try {
      await updateUser(user?.id ?? "", data);
      toast("Profile updated!");
    } catch (error) {
      console.log(error);
      toast("Update failed! Some thing went wrong.");
    }
  };

  return (
    <>
      <h2 className="text-[22px] font-bold mb-6">My profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-16">
        <div className="flex-shrink-0">
          <Avatar
            src={user?.profilePic}
            name={user?.firstName}
            className="overflow-hidden rounded-full group cursor-pointer"
            size={120}
          >
            <div
              className="absolute inset-0 bg-gray-700 bg-opacity-70 opacity-0
             group-hover:opacity-100 transition-all flex-center text-white duration-300"
            >
              <MdEdit />
            </div>
          </Avatar>
        </div>
        <div className="flex-1 space-y-8">
          <div className="flex space-x-7">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-2">
                First name*
              </label>
              <Input
                {...register("firstName")}
                error={errors?.firstName?.message}
                placeholder="First name"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-2">
                Last name*
              </label>
              <Input
                {...register("lastName")}
                error={errors?.lastName?.message}
                placeholder="Last name"
                defaultValue={user?.lastName}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">
              Display name*
            </label>
            <Input
              {...register("displayName")}
              error={errors?.displayName?.message}
              placeholder="Display name"
              defaultValue={user?.displayName}
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">
              Tell us about yourself
            </label>
            <TextArea
              rows={6}
              placeholder="Type your bio here..."
              defaultValue=""
            />
          </div>
          <div>
            <Button
              loading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              className="w-[120px] font-semibold"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
export default MyProfile;
