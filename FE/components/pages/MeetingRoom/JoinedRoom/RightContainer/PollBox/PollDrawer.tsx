import { motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../../../../../common/Button/Button";
import Drawer from "../../../../../common/Drawer/Drawer";
import Input from "../../../../../common/Input/Input";
import TextArea from "../../../../../common/Textarea/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { RoomContext } from "../../../../../contexts/RoomContext";
import { addPoll } from "../../../../../../lib/redux/slices/polls.slice";
import { useAppDispatch } from "../../../../../../hooks/redux";

interface PollDrawerProps {
  isOpen: boolean;
  onClose: () => any;
}

interface PollData {
  question: string;
  options: { value: string }[];
}

const pollSchema = yup.object({
  question: yup.string().trim().required("Question is required"),
  options: yup.array().of(
    yup.object().shape({
      value: yup.string().trim().required("Option is required"),
    })
  ),
});

const initialValue: PollData = {
  options: [{ value: "" }, { value: "" }],
  question: "",
};

const PollDrawer = ({ isOpen, onClose }: PollDrawerProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PollData>({
    resolver: yupResolver(pollSchema),
    defaultValues: initialValue,
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: PollData) => {
    try {
      const sendData = {
        question: data.question.trim(),
        options: data.options.map((option) => option.value.trim()),
      };

      const newPoll = await socket.request("newPoll", sendData);
      dispatch(addPoll(newPoll));

      reset(initialValue);
      onClose();
    } catch (error) {}
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right">
      <div className="relative z-50 max-w-[480px] w-screen bg-white h-full flex flex-col">
        <div className="h-[70px] flex items-center px-5 text-gray-800 border-b font-semibold flex-shrink-0">
          Add a poll
        </div>
        <div className="py-5 px-6 space-y-4 flex-1 scrollbar1 overflow-y-auto">
          <div>
            <h2 className="font-semibold text-lg mb-2">Question*</h2>
            <TextArea
              error={errors?.question?.message}
              {...register("question")}
              rows={5}
              placeholder="Enter your question"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Options</h2>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="relative">
                  <Input
                    error={errors?.options?.[index]?.value?.message}
                    placeholder={`Option ${index + 1}`}
                    {...register(`options.${index}.value`)}
                  />
                  {index > 1 && (
                    <button
                      onClick={() => remove(index)}
                      className="absolute right-0 top-0 h-[38px] flex-center translate-x-1/2 text-gray-700"
                    >
                      <AiOutlineMinusCircle className="bg-white" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                onClick={() => append({ value: "" })}
                base="light"
                className="font-semibold"
              >
                Add option
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="font-semibold text-[14px]"
          >
            Send poll
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-full top-0 p-3 z-40">
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                delay: 0.15,
                type: "keyframes",
                duration: 0.12,
              },
            }}
            exit={{ x: 100, opacity: 0, transition: { duration: 0.15 } }}
            onClick={onClose}
            className="p-2 bg-truegray-600 hover:bg-truegray-500 text-white rounded-lg transition-colors"
          >
            <IoCloseOutline />
          </motion.button>
        </div>
      )}
    </Drawer>
  );
};

export default PollDrawer;
