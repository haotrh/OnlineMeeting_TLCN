import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { redirect: { destination: "/app/meet", permanent: false } };
};

const AppRedirectPage = () => {
  return null;
};

export default AppRedirectPage;
