import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { addQuestion } from "../../../../../../lib/redux/slices/questions.slice";
import Button from "../../../../../common/Button/Button";
import Modal from "../../../../../common/Modal/Modal";
import TextArea from "../../../../../common/Textarea/Textarea";
import { RoomContext } from "../../../../../contexts/RoomContext";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => any;
}

const QuestionModal = ({ isOpen, onClose }: QuestionModalProps) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    if (!question.trim()) {
      setError("Plese enter question");
      setLoading(false);
      return;
    }
    try {
      const newQuestion = await socket.request("askNewQuestion", {
        question: question.trim(),
      });

      dispatch(addQuestion(newQuestion));

      onClose();
    } catch (error) {
      console.log(error);
      setError(error as string);
    }
    setQuestion("");
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white mt-16 w-[420px] rounded-md p-4 relative">
        <div className="relative mb-4 font-bold text-center">
          Ask a new question
          <button className="absolute top-0 right-0">
            <MdClose onClick={onClose} size={18} />
          </button>
        </div>
        <TextArea
          value={question}
          onChange={(e) => setQuestion((e.target as HTMLTextAreaElement).value)}
          className="mb-3"
          rows={5}
          placeholder="Ask a new question"
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
            Send question
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionModal;
