import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { AppLayout } from "../layouts/AppLayout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { session } };
};

const ProfilePage: NextPage = () => {
  return <AppLayout>asdasdsd</AppLayout>;
};

export default ProfilePage;
