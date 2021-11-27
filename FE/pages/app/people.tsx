import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import AppLayout from "../../layouts/AppLayout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  if (!session.user.isVerified)
    return { redirect: { destination: "/verify-request", permanent: false } };

  return { props: { session } };
};

const AppPeoplePage = () => {
  return <AppLayout title="People">asdasd</AppLayout>;
};

export default AppPeoplePage;
