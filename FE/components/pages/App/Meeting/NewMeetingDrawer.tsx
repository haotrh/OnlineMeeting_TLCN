import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as yup from "yup";
import { roomApi } from "../../../../lib/serverApi";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import AppDrawer, { AppDrawerProps } from "../AppDrawer/AppDrawer";

const schema = yup.object({
  name: yup
    .string()
    .required("Please enter meeting name")
    .min(6, "Name must be at least 6 characters long"),
});

const NewMeetingDrawer = ({ title, onClose, ...props }: AppDrawerProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const queryClient = useQueryClient();

  const createRoomMutation = useMutation(roomApi.createRoom, {
    onMutate: async () => {
      await queryClient.cancelQueries("createdRooms");
    },
    onSuccess: async (newRoom) => {
      onClose();
      queryClient.setQueryData("createdRooms", (old: any) => {
        return [...old, newRoom];
      });
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  const onSubmit = async (data: any) => {
    await createRoomMutation.mutateAsync(data);
  };

  return (
    <AppDrawer onClose={onClose} {...props} title="Create a meeting room">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-gray-700"
      >
        <div>
          <label className="font-semibold block mb-2 text-sm">Name*</label>
          <Input
            error={errors?.name?.message}
            {...register("name")}
            placeholder="My meeting room name"
          />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-sm">Guests</label>
          <Input placeholder="My meeting room name" />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} base="light" className="font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="font-semibold"
          >
            Create meeting room
          </Button>
        </div>
      </form>
    </AppDrawer>
  );
};

export default NewMeetingDrawer;
