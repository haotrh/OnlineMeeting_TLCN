import AppDrawer, { AppDrawerProps } from "../AppDrawer/AppDrawer";
import * as yup from "yup";
import { User } from "../../../../types/user.type";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../common/Input/Input";
import MeetingRoomSettings from "./MeetingRoomSettings";
import MeetingSearchUsers from "./MeetingSearchUsers";
import Button from "../../../common/Button/Button";
import { FormProvider, useForm } from "react-hook-form";
import { Room, RoomData } from "../../../../types/room.type";
import _ from "lodash";
import DeleteRoomModal from "./DeleteRoomModal";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup
    .string()
    .required("Please enter meeting name")
    .min(6, "Name must be at least 6 characters long"),
});

export type MeetingFormData = {
  name: string;
  guests: User[];
  allowCamera: boolean;
  allowChat: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  allowQuestion: boolean;
  allowRaiseHand: boolean;
};

const initData = {
  name: "",
  guests: [],
  allowCamera: true,
  allowChat: true,
  allowMicrophone: true,
  allowScreenShare: true,
  allowQuestion: true,
  allowRaiseHand: true,
};

interface MeetingDrawerProps extends AppDrawerProps {
  onSubmit: (data: MeetingFormData) => any;
  room?: Room;
  readOnly?: boolean;
}

const MeetingDrawer = ({
  title,
  onClose,
  onSubmit,
  room = {} as Room,
  readOnly = false,
  ...props
}: MeetingDrawerProps) => {
  const { id, host, hostId, createdAt, updatedAt, ...roomData } =
    useMemo(() => {
      return room as any;
    }, []);

  const isEdit = useMemo(() => {
    return !_.isEmpty(room) && !readOnly;
  }, []);

  const methods = useForm<MeetingFormData>({
    resolver: yupResolver(schema),
    defaultValues: !_.isEmpty(room) ? roomData : initData,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [deleteRoom, setDeleteRoom] = useState(false);

  const onFormSubmit = async (data: MeetingFormData) => {
    try {
      await onSubmit(data);
      _.isEmpty(room) && reset(initData);
    } catch (error: any) {
      console.log(error);
      toast(error?.reponse?.data?.message);
    }
  };

  return (
    <AppDrawer onClose={onClose} {...props} title={title}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6 text-gray-700 font-quicksand"
        >
          {!_.isEmpty(room) && (
            <div>
              <label className="font-bold block mb-2">Room id</label>
              <Input value={room.id} disabled={true} />
            </div>
          )}
          <div>
            <label className="font-bold block mb-2">
              Name{!readOnly && "*"}
            </label>
            <Input
              disabled={readOnly}
              autoComplete="new-password"
              error={errors?.name?.message}
              {...register("name")}
              placeholder="My meeting room name"
            />
          </div>
          <MeetingRoomSettings readOnly={readOnly} />
          <MeetingSearchUsers readOnly={readOnly} />
          <div>
            {isEdit && (
              <div className="text-right text-[12.5px] -mt-2 -mb-5 font-semibold">
                *These changes will not affect the current active room.
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} base="light" className="font-semibold">
              Cancel
            </Button>
            {!readOnly && (
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="font-semibold"
              >
                {isEdit ? "Edit meeting room" : "Create meeting room"}
              </Button>
            )}
          </div>
          {isEdit && (
            <>
              <hr />
              <div className="flex justify-end">
                <Button
                  onClick={() => setDeleteRoom(true)}
                  base="danger"
                  className="font-semibold"
                >
                  Delete meeting room
                </Button>
              </div>
              <DeleteRoomModal
                roomId={room?.id ?? ""}
                isOpen={deleteRoom}
                onClose={() => setDeleteRoom(false)}
              />
            </>
          )}
        </form>
      </FormProvider>
    </AppDrawer>
  );
};

export default MeetingDrawer;
