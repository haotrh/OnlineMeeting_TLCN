import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteAccount } from "../../../../lib/serverApi/user.api";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import Modal from "../../../common/Modal/Modal";

interface DeleteAccoutModalProps {
  isOpen: boolean;
  onClose: () => any;
}

const DeleteAccoutModal = ({ isOpen, onClose }: DeleteAccoutModalProps) => {
  const session = useSession();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount(session?.data?.user?.id ?? "");
      signOut({ redirect: true, callbackUrl: "/" });
    } catch (error: any) {
      console.log(error);
      toast(error?.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mt-10 bg-white w-[460px] p-5 rounded-md shadow-md relative font-be">
        <div className="text-center font-semibold">Delete account</div>
        <Button
          onClick={onClose}
          base="custom"
          className="absolute right-0 top-0 p-4 text-gray-500 hover:text-gray-700 text-xl transition-colors"
        >
          <MdClose />
        </Button>
        <div className="mt-5 text-sm text-gray-500">
          Are you sure? Your profile and related account information will be
          deleted from our site.
        </div>
        <div className="mt-6">
          <label className="text-sm font-semibold text-red-500 block mb-2">
            Type DELETE to confirm
          </label>
          <Input
            value={text}
            onChange={(e) => setText((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="mt-4 space-x-3 flex">
          <Button
            base="danger"
            loading={loading}
            onClick={handleDelete}
            disabled={text.toLowerCase() !== "delete"}
            className="font-semibold w-40"
          >
            Delete my account
          </Button>
          <Button onClick={onClose} base="light" className="font-semibold">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccoutModal;
