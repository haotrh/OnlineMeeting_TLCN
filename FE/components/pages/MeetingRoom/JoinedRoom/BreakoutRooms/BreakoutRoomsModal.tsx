import { FormProvider, useForm } from "react-hook-form";
import Modal from "../../../../common/Modal/Modal";
import BreakoutRoomsControl from "./BreakoutRoomsControl";

interface BreakoutRoomsModalProps {
  isOpen: boolean;
  onClose: () => any;
}

export const BreakoutRoomsModal = ({
  isOpen,
  onClose,
}: BreakoutRoomsModalProps) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-[560px] h-screen py-12 pointer-events-none"
      >
        <div className="bg-white my-auto flex flex-col w-full rounded-lg h-full pointer-events-auto">
          <div className="p-3 border-b select-none text-sm font-semibold">
            Breakout Rooms
          </div>
          <div className="flex-1 bg-gray-100/70">asdasdasdasdasdasdasd</div>
          <BreakoutRoomsControl />
        </div>
      </Modal>
    </FormProvider>
  );
};
