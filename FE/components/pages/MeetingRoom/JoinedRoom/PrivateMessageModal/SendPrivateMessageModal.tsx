import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "../../../../common/Button/Button";
import Modal from "../../../../common/Modal/Modal";
import TextArea from "../../../../common/Textarea/Textarea";
import { RoomContext } from "../../../../contexts/RoomContext";

interface SendPrivateMessageModalProp {
  isOpen: boolean;
  onClose: () => any;
  peerId: string;
}

const SendPrivateMessageModal = ({
  isOpen,
  onClose,
  peerId,
}: SendPrivateMessageModalProp) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { socket } = useContext(RoomContext);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    if (!message.trim()) {
      setError("Plese enter question");
      setLoading(false);
      return;
    }
    try {
      await socket.request("host:sendPrivateMessage", {
        message: message.trim(),
        peerId,
      });
      onClose();
    } catch (error) {
      console.log(error);
      setError(error as string);
    }
    setMessage("");
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white mt-16 w-[420px] rounded-md p-4 relative">
        <div className="relative mb-4 font-bold text-center">
          Send private message
          <button className="absolute top-0 right-0">
            <MdClose onClick={onClose} size={18} />
          </button>
        </div>
        <TextArea
          value={message}
          onChange={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          className="mb-3"
          rows={5}
          placeholder="Send private message"
        />
        {error && (
          <div className="text-sm text-red-600 -mt-3 mb-3 font-medium">
            {error}
          </div>
        )}
        <div>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            base="light-primary"
            className="w-full font-semibold"
          >
            Send message
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendPrivateMessageModal;
