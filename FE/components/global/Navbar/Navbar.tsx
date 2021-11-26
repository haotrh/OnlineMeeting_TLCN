import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useScrollDirection, {
  ScrollDirection,
} from "../../../hooks/useScrollDirection";
import Popover from "../../common/Popover/Popover";
import Avatar from "../Avatar/Avatar";
import Logo from "../Logo/Logo";

enum NavbarState {
  TOP = "top",
  VISIBLE = "visible",
  HIDDEN = "hidden",
}

const Navbar = () => {
  const session = useSession();

  const [navbarState, setNavbarState] = useState<NavbarState>(
    NavbarState.HIDDEN
  );

  const [toggleMenu, setToggleMenu] = useState(false);

  useScrollDirection({
    initialDirection: ScrollDirection.DOWN,
    thresholdPixels: 2,
    event: (scrollY, scrollDir) => {
      if (scrollY < 45) {
        if (scrollY < 15) setNavbarState(NavbarState.TOP);
        else setNavbarState(NavbarState.VISIBLE);
        return;
      }
      if (scrollDir === ScrollDirection.DOWN) {
        setNavbarState(NavbarState.HIDDEN);
      } else {
        setNavbarState(NavbarState.VISIBLE);
      }
    },
  });

  useEffect(() => {
    if (window && window.scrollY < 45) {
      setNavbarState(NavbarState.TOP);
    }
  }, []);

  return (
    <div
      className={classNames(
        "flex-center fixed top-0 left-0 w-screen z-50 py-3 h-[60px]",
        {
          "bg-transparent": navbarState === NavbarState.TOP,
          "-translate-y-full transition-transform duration-300 bg-white":
            navbarState === NavbarState.HIDDEN,
          "bg-white translate-y-0 shadow transition-transform duration-300":
            navbarState === NavbarState.VISIBLE,
        }
      )}
      // className="flex-center"
    >
      <div className="max-w-7xl w-full flex justify-between items-center relative">
        <Link href="/">
          <a className="cursor-pointer flex items-center select-none">
            <Logo className="max-h-[60px]" />
            <span className="font-poppins font-semibold text-sm">OMEETING</span>
          </a>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-poppins font-semibold">
          {session.status === "unauthenticated" ? (
            <>
              <Link href="/login">
                <a className="hover:border-b-[1.5px] border-gray-500">Login</a>
              </Link>
              <Link href="/register">
                <a>
                  <button
                    className="border-[1.5px] font-medium from-blue-500 to-purple-600 bg-gradient-to-br
                px-5 text-white rounded-full py-2.5"
                  >
                    Start For Free
                  </button>
                </a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/app">
                <a className="hover:underline border-gray-500">Go to app</a>
              </Link>
              <Popover
                interactive={true}
                visible={toggleMenu}
                onClickOutside={() => setToggleMenu(false)}
                placement="bottom-end"
                className="origin-top-right"
                offset={[3, 5]}
                content={
                  <div className="border border-gray-300 py-2 font-medium rounded-md shadow w-[200px] bg-white">
                    <div className="py-1.5 px-3">
                      <div>{session?.data?.user?.displayName}</div>
                      <div className="text-[13px]">
                        {session?.data?.user?.email}
                      </div>
                    </div>
                    <hr className="my-1" />
                    <div>
                      <button
                        onClick={() => signOut()}
                        className="w-full py-2 hover:text-white hover:bg-blue-500 transition-colors font-medium text-left px-3"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  </div>
                }
              >
                <div
                  onClick={() => setToggleMenu(!toggleMenu)}
                  className="cursor-pointer"
                >
                  <Avatar
                    src={session.data?.user?.profilePic}
                    name={session.data?.user?.firstName}
                  />
                </div>
              </Popover>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
