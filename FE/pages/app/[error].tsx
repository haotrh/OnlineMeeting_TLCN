import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { redirect: { destination: "/app", permanent: false } };
};

const AppErrorRedirectPage = () => {
  return null;
};

export default AppErrorRedirectPage;
