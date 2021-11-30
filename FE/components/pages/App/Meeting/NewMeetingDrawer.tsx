import { useMutation, useQueryClient } from "react-query";
import { roomApi } from "../../../../lib/serverApi";
import { AppDrawerProps } from "../AppDrawer/AppDrawer";
import MeetingDrawer, { MeetingFormData } from "./MeetingDrawer";

const NewMeetingDrawer = ({ title, onClose, ...props }: AppDrawerProps) => {
  const queryClient = useQueryClient();

  const createRoomMutation = useMutation(roomApi.createRoom, {
    onMutate: async () => {
      await queryClient.cancelQueries("rooms");
    },
    onSuccess: async (newRoom) => {
      onClose();
      queryClient.setQueryData("rooms", (old: any) => {
        return [newRoom, ...old];
      });
    },
    onError: (err: any) => {
      console.log(err?.response?.data ?? err);
    },
  });

  const onSubmit = async (data: MeetingFormData) => {
    const { guests, ...meetingData } = data;

    return createRoomMutation.mutateAsync({
      ...meetingData,
      guests: guests.map((guest) => guest.id),
    });
  };

  return (
    <MeetingDrawer
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
      title="Create a meeting room"
    />
  );
};

export default NewMeetingDrawer;
