import { useMutation, useQueryClient } from "react-query";
import { roomApi } from "../../../../lib/api";
import { Room } from "../../../../types/room.type";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import AppDrawer, { AppDrawerProps } from "../AppDrawer/AppDrawer";

interface EditMeetingDrawerProps extends AppDrawerProps {
  room: Room;
}

const EditMeetingDrawer = ({
  title,
  onClose,
  room,
  ...props
}: EditMeetingDrawerProps) => {
  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation(roomApi.deleteRoom, {
    onMutate: async () => {
      await queryClient.cancelQueries("createdRooms");
    },
    onSuccess: async () => {
      onClose();
      queryClient.setQueryData("createdRooms", (old: any) => {
        return old.filter((oldRoom: any) => room.id !== oldRoom.id);
      });
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  return (
    <AppDrawer onClose={onClose} {...props} title="Edit meeting room">
      <div className="space-y-6 text-gray-700">
        <div>
          <label className="font-semibold block mb-2 text-sm">Name*</label>
          <Input defaultValue={room.name} placeholder="My meeting room name" />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-sm">Guests</label>
          <Input placeholder="My meeting room name" />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} base="light" className="font-semibold">
            Cancel
          </Button>
          <Button className="font-semibold">Edit meeting room</Button>
        </div>
        <hr />
        <div className="flex justify-end">
          <Button
            disabled={deleteRoomMutation.isLoading}
            loading={deleteRoomMutation.isLoading}
            onClick={() => {
              room.id && deleteRoomMutation.mutate(room.id);
            }}
            base="danger"
            className="font-semibold"
          >
            Delete meeting room
          </Button>
        </div>
      </div>
    </AppDrawer>
  );
};

export default EditMeetingDrawer;
