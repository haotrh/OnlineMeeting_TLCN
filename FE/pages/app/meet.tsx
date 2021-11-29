import _ from "lodash";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { BiNote } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useQuery } from "react-query";
import { userApi } from "../../api";
import { OptionType, Select } from "../../components/common/Select/Select";
import { ThreeDotsLoading } from "../../components/global/Loading/ThreeDotsLoading";
import MeetingCard from "../../components/pages/App/Meeting/MeetingCard";
import NewMeetingButton from "../../components/pages/App/Meeting/NewMeetingButton";
import AppLayout from "../../layouts/AppLayout";
import { Room, RoomData } from "../../types/room.type";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  if (!session.user.isVerified)
    return { redirect: { destination: "/verify-request", permanent: false } };

  return { props: { session } };
};

type FilterByType = "all" | "my_rooms" | "invited_rooms";

const filterByOptions: { label: string; value: FilterByType }[] = [
  { label: "All rooms", value: "all" },
  { label: "My rooms", value: "my_rooms" },
  { label: "Invited rooms", value: "invited_rooms" },
];

const AppMeetPage = () => {
  const session = useSession();
  const user = session.data?.user;

  const rooms = useQuery("rooms", () => userApi.getRooms(user?.id ?? "-1"), {
    refetchInterval: Infinity,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  const [roomFilter, setRoomFilter] = useState<FilterByType>("all");

  const filteredRooms = useMemo(() => {
    return rooms.data
      ? rooms.data.filter((room: RoomData) => {
          switch (roomFilter) {
            case "all": {
              return true;
            }
            case "my_rooms": {
              return room.host.id === user?.id;
            }
            case "invited_rooms": {
              return room.host.id !== user?.id;
            }
          }
        })
      : [];
  }, [rooms.data, roomFilter, user]);

  return (
    <AppLayout title="Meeting">
      <div className="h-16 bg-white px-10 flex items-center justify-between border-b sticky top-16 z-20 shadow-sm">
        <div className="">
          <Select
            icon={BsFilter}
            onChange={(value) => setRoomFilter(value)}
            options={filterByOptions}
            placement="bottom-start"
          />
        </div>
        <div>
          <NewMeetingButton />
        </div>
      </div>
      {rooms.isLoading ? (
        <div className="flex-center py-10">
          <ThreeDotsLoading />
        </div>
      ) : (
        <>
          {_.isEmpty(filteredRooms) ? (
            <div className="py-10 text-center font-semibold">
              <div className="select-none flex-center">
                <img src="/box-error.png" className="h-40" alt="icon" />
              </div>
              Your meeting rooms list is empty!
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(3,1fr)] auto-rows-[1fr] gap-5 px-10 py-6">
              {filteredRooms.map((room: RoomData) => (
                <MeetingCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default AppMeetPage;
