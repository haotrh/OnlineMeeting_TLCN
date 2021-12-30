import _ from "lodash";
import { MdClose } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { setPrivateMessage } from "../../../../../lib/redux/slices/room.slice";
import Modal from "../../../../common/Modal/Modal";

const PrivateMessageModal = () => {
  const privateMessage = useAppSelector(
    (selector) => selector.room.privateMessage
  );

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setPrivateMessage(""));
  };

  return (
    <Modal isOpen={!_.isEmpty(privateMessage)} onClose={handleClose}>
      <div className="bg-white mt-16 w-[420px] rounded-md p-4 relative">
        <div className="relative mb-4 font-bold text-center">
          Host private message
          <button className="absolute top-0 right-0">
            <MdClose onClick={handleClose} size={18} />
          </button>
        </div>
        <div className="whitespace-pre-wrap">{privateMessage}</div>
      </div>
    </Modal>
  );
};

export default PrivateMessageModal;
