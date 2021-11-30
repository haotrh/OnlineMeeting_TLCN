import { useMutation, useQueryClient } from "react-query";
import { roomApi } from "../../../../lib/serverApi";
import { Room, RoomData } from "../../../../types/room.type";
import { AppDrawerProps } from "../AppDrawer/AppDrawer";
import MeetingDrawer, { MeetingFormData } from "./MeetingDrawer";

interface EditMeetingDrawerProps extends AppDrawerProps {
  room: Room;
  readOnly: boolean;
}

const EditMeetingDrawer = ({
  title,
  onClose,
  readOnly,
  room,
  ...props
}: EditMeetingDrawerProps) => {
  const queryClient = useQueryClient();

  const updateRoomMutation = useMutation(
    (data: any) => roomApi.updateRoom(room?.id ?? "", data),
    {
      onMutate: async () => {
        await queryClient.cancelQueries("rooms");
      },
      onSuccess: async (newRoom: any) => {
        onClose();
        queryClient.setQueryData("rooms", (old: any) => {
          return old.map((oldRoom: RoomData) =>
            oldRoom.id === newRoom.id ? newRoom : oldRoom
          );
        });
      },
      onError: (err: any) => {
        console.log(err?.response?.data ?? err);
      },
    }
  );

  const onSubmit = (data: MeetingFormData) => {
    const { guests, ...meetingData } = data;

    return updateRoomMutation.mutateAsync({
      ...meetingData,
      guests: guests.map((guest) => guest.id),
    });
  };

  return (
    <MeetingDrawer
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
      title={readOnly ? "Room information" : "Edit meeting room"}
      room={room}
      readOnly={readOnly}
    />
  );
};

export default EditMeetingDrawer;
