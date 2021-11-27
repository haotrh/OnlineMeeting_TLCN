import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { createContext, useState } from "react";
import MyProfile from "../../components/pages/App/AccountSettings/MyProfile";
import MySettings from "../../components/pages/App/AccountSettings/MySettings";
import SettingsMenu from "../../components/pages/App/AccountSettings/SettingsMenu";
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

export type SettingsPageTabs = "user-settings" | "user-profile";

export const SettingsPageContext = createContext({});

const SettingsPage = () => {
  const [currentTab, setCurrentTab] =
    useState<SettingsPageTabs>("user-settings");

  return (
    <AppLayout title="Account settings" noSearch>
      <SettingsPageContext.Provider value={{ currentTab, setCurrentTab }}>
        <div className="flex flex-1 bg-white">
          <div className="w-64 border-r">
            <SettingsMenu />
          </div>
          <div className="flex-1 pt-10 px-16 max-w-[640px] relative">
            <AnimatePresence>
              {currentTab === "user-settings" && (
                <motion.div
                  className="absolute w-full"
                  key="user-settings-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <MySettings />
                </motion.div>
              )}
              {currentTab === "user-profile" && (
                <motion.div
                  className="absolute w-full"
                  key="user-profile-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <MyProfile />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SettingsPageContext.Provider>
    </AppLayout>
  );
};

export default SettingsPage;
