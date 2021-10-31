import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import Drawer, { DrawerProps } from "../../../common/Drawer/Drawer";

export interface AppDrawerProps extends DrawerProps {
  title?: string;
}

const AppDrawer = ({
  children,
  position,
  isOpen,
  onClose,
  title,
  ...props
}: AppDrawerProps) => {
  return (
    <Drawer {...props} isOpen={isOpen} onClose={onClose} position="right">
      <div className="relative z-50 max-w-[650px] w-screen bg-white h-full">
        {title && (
          <div className="py-6 px-8 text-2xl border-b font-semibold">
            {title}
          </div>
        )}
        <div className="p-8">{children}</div>
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
            className="p-2 bg-black/50 hover:bg-black/30 text-white rounded-lg"
          >
            <IoCloseOutline />
          </motion.button>
        </div>
      )}
    </Drawer>
  );
};

export default AppDrawer;
