import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../../../../../common/Button/Button";
import Drawer from "../../../../../common/Drawer/Drawer";
import Input from "../../../../../common/Input/Input";
import TextArea from "../../../../../common/Textarea/Textarea";

interface PollDrawerProps {
  isOpen: boolean;
  onClose: () => any;
}

const PollDrawer = ({ isOpen, onClose }: PollDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right">
      <div className="relative z-50 max-w-[480px] w-screen bg-white h-full flex flex-col">
        <div className="h-[70px] flex items-center px-5 text-gray-800 border-b font-semibold flex-shrink-0">
          Add a poll
        </div>
        <div className="py-5 px-6 space-y-4 flex-1 scrollbar1 overflow-y-auto">
          <div>
            <h2 className="font-semibold text-lg mb-2">Question*</h2>
            <TextArea rows={5} placeholder="Enter your question" />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Options</h2>
            <div className="space-y-2">
              <Input placeholder="Option 1" />
              <Input placeholder="Option 2" />
              <Input placeholder="Option 3" />
              <Input placeholder="Option 4" />
              <Input placeholder="Option 4" />
              <Input placeholder="Option 4" />
              <Input placeholder="Option 4" />
              <Input placeholder="Option 4" />
              <Button base="light" className="font-semibold">
                Add option
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <Button className="font-semibold text-[14px]">Send poll</Button>
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
