import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { userApi } from "../../api";
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

const AppMeetPage = () => {
  const session = useSession();
  const user = session.data?.user;

  const createdRooms = useQuery("createdRooms", () =>
    userApi.getCreatedRooms(user.id)
  );

  return (
    <AppLayout title="Meeting">
      <div className="grid grid-cols-[repeat(3,1fr)] auto-rows-[1fr] gap-5 px-10 py-4">
        {createdRooms.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {createdRooms.data.map((room: Room) => (
              <MeetingCard key={room.id} user={user} room={room} />
            ))}
            <NewMeetingButton />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default AppMeetPage;
