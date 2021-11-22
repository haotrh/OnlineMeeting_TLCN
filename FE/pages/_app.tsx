/* eslint-disable @next/next/no-page-custom-font */
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { store } from "../lib/redux/store";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href={
            "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          }
          rel="stylesheet"
        />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Component {...pageProps} />
            <ToastContainer
              limit={5}
              position="bottom-left"
              toastClassName="!bg-white shadow-md border !p-2 !min-h-0 !min-w-0 !rounded-lg"
              bodyClassName="text-sm font-poppins !m-0 font-semibold text-gray-800"
              autoClose={3000}
              transition={Slide}
              pauseOnHover={false}
              hideProgressBar={true}
              draggable={false}
              closeButton={false}
            />
          </Provider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
export default MyApp;
