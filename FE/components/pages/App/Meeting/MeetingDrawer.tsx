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
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { roomApi } from "../../../../api";
import { ThreeDotsLoading } from "../../../global/Loading/ThreeDotsLoading";
import CircularLoading from "../../../global/Loading/CircularLoading";

const schema = yup.object({
  name: yup
    .string()
    .required("Please enter meeting name")
    .min(6, "Name must be at least 6 characters long"),
});

export type MeetingFormData = {
  name: string;
  guests: User[];
  isPrivate: boolean;
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
  isPrivate: false,
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

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const refetchRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await roomApi.getRoom(room?.id ?? "");
      queryClient.setQueryData("rooms", (old: any) => {
        return old.map((oldRoom: RoomData) =>
          oldRoom.id === newRoom.id ? newRoom : oldRoom
        );
      });

      const { id, host, hostId, createdAt, updatedAt, ...roomData } =
        newRoom as RoomData;

      reset(roomData);
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Server error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props.isOpen && isEdit) {
      refetchRoom();
    }
  }, [props.isOpen]);

  return (
    <AppDrawer onClose={onClose} {...props} title={title}>
      {!loading && !error && (
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
                  *These changes will affect on the current active room.
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
      )}
      {loading && !error && (
        <div className="flex-1 flex-center h-full flex-col">
          <CircularLoading size={36} />
          <div className="mt-2 font-semibold text-indigo-600">Loading...</div>
        </div>
      )}
      {error && (
        <div className="text-center">
          <div>
            <img src="/timeout.png" alt="time out" className="h-40 mx-auto" />
          </div>
          <div className="text-lg font-semibold text-darkblue">{error}</div>
          <div className="mt-2">
            <Button
              onClick={refetchRoom}
              base="light-primary"
              className="font-semibold"
            >
              Try again
            </Button>
          </div>
        </div>
      )}
    </AppDrawer>
  );
};

export default MeetingDrawer;
