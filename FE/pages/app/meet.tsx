import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { FiPlus, FiPlusCircle } from "react-icons/fi";
import AppDrawer from "../../components/pages/App/AppDrawer/AppDrawer";
import MeetingCard from "../../components/pages/App/Meeting/MeetingCard";
import NewMeetingButton from "../../components/pages/App/Meeting/NewMeetingButton";
import AppLayout from "../../layouts/AppLayout";

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

  return (
    <AppLayout title="Meeting">
      <div className="grid grid-cols-[repeat(3,1fr)] auto-rows-[1fr] gap-5 px-10 py-4">
        <MeetingCard user={user} name="Hoi nghi ban tron" id="sads-wew-xcs" />
        <MeetingCard user={user} name="Hoi nghi ban tron" id="sads-wew-xcs" />
        <MeetingCard user={user} name="Hoi nghi ban tron" id="sads-wew-xcs" />
        <MeetingCard user={user} name="Hoi nghi ban tron" id="sads-wew-xcs" />
        <NewMeetingButton />
      </div>
    </AppLayout>
  );
};

export default AppMeetPage;
