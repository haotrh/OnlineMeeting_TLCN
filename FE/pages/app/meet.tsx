import _ from "lodash";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { BiNote } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useQuery } from "react-query";
import { userApi } from "../../api";
import { OptionType, Select } from "../../components/common/Select/Select";
import { ThreeDotsLoading } from "../../components/global/Loading/ThreeDotsLoading";
import MeetingCard from "../../components/pages/App/Meeting/MeetingCard";
import NewMeetingButton from "../../components/pages/App/Meeting/NewMeetingButton";
import AppLayout from "../../layouts/AppLayout";
import { Room } from "../../types/room.type";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { session } };
};

type RoomOption = "all" | "myroom" | "invited";

const AppMeetPage = () => {
  const session = useSession();
  const user = session.data?.user;

  const createdRooms = useQuery("createdRooms", () =>
    userApi.getCreatedRooms(user.id)
  );

  const roomOptions: OptionType[] = [
    { label: "All room", value: "all" },
    { label: "My room", value: "myroom" },
    { label: "Invited room", value: "invited" },
  ];

  const [roomOption, setRoomOption] = useState<RoomOption>("all");

  return (
    <AppLayout title="Meeting">
      <div className="h-16 bg-white px-10 flex items-center justify-between border-b">
        <div>
          <Select
            icon={BsFilter}
            onChange={(value) => setRoomOption(value)}
            options={roomOptions}
            placement="bottom-start"
          />
        </div>
        <div>
          <NewMeetingButton />
        </div>
      </div>
      {createdRooms.isLoading ? (
        <div className="flex-center py-10">
          <ThreeDotsLoading />
        </div>
      ) : (
        <>
          {_.isEmpty(createdRooms.data) ? (
            <div className="py-10 text-center font-semibold">
              <BiNote className="mx-auto" size={40} />
              Your meeting rooms list is empty!
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(3,1fr)] auto-rows-[1fr] gap-5 px-10 py-6">
              {createdRooms.data.map((room: Room) => (
                <MeetingCard key={room.id} user={user} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default AppMeetPage;
