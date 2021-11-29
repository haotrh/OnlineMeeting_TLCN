import { AiFillWarning } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { roomApi } from "../../../../api";
import Button from "../../../common/Button/Button";
import Modal from "../../../common/Modal/Modal";

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => any;
  roomId: string;
}

const DeleteRoomModal = ({ isOpen, onClose, roomId }: DeleteRoomModalProps) => {
  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation(roomApi.deleteRoom, {
    onMutate: async () => {
      await queryClient.cancelQueries("rooms");
    },
    onSuccess: async () => {
      onClose();
      queryClient.setQueryData("rooms", (old: any) => {
        return old.filter((oldRoom: any) => roomId !== oldRoom.id);
      });
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="translate-y-10 w-[500px] bg-white p-3 rounded-md border shadow-lg relative">
        <div className="text-center font-semibold mb-4">
          Do you want to delete room?
        </div>
        <div className="bg-yellow-50 p-4 flex rounded-md mb-3 font-medium text-sm font-quicksand items-center">
          <AiFillWarning
            className="mr-3 flex-shrink-0 text-yellow-500"
            size={25}
          />
          <div>
            Warning, deletion is definitive and cannot be undone. This meeting
            room will no longer be accessible anymore.
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} base="light" className="font-semibold">
            Close
          </Button>
          <Button
            disabled={deleteRoomMutation.isLoading}
            loading={deleteRoomMutation.isLoading}
            onClick={() => deleteRoomMutation.mutate(roomId)}
            base="danger"
            className="font-semibold"
          >
            Delete meeting room
          </Button>
        </div>
        <button
          onClick={onClose}
          className="right-0 top-0 absolute p-3 text-lg"
        >
          <MdClose />
        </button>
      </div>
    </Modal>
  );
};

export default DeleteRoomModal;
