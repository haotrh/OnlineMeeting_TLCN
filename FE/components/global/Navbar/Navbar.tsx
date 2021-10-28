import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useScrollDirection, {
  ScrollDirection,
} from "../../../hooks/useScrollDirection";
import Popover from "../../common/Popover/Popover";

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
  const [accountMenu, setAccountMenu] = useState(false);

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
          <a className="cursor-pointer">
            <img
              alt="Logo"
              className="max-h-[20px] cursor-pointer"
              src="https://st1.zoom.us/static/5.2.2562/image/new/ZoomLogo.png"
            />
          </a>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-poppins font-semibold">
          {session.status === "authenticated" ? (
            <>
              <Link href="/join">
                <a className="hover:border-b-[1.5px] border-gray-500">
                  JOIN A MEETING
                </a>
              </Link>
              <button className="font-semibold">HOST A MEETING</button>
              <Popover
                interactive={true}
                visible={accountMenu}
                onClickOutside={() => setAccountMenu(false)}
                placement="bottom-end"
                offset={[3, 7]}
                content={
                  <div
                    onClick={() => setAccountMenu(false)}
                    className="py-2 text-[15px] font-medium min-w-[200px]"
                  >
                    <Link href="/profile">
                      <a className="block px-4 py-2 hover:text-blue-600 mb-3">
                        <div className="mb-1">{session.data.user?.name}</div>
                        <div>{session.data.user?.email}</div>
                      </a>
                    </Link>
                    <hr />
                    <button
                      onClick={() => signOut()}
                      className="mt-2 hover:bg-blue-500 hover:text-white
                    block px-4 py-2 w-full text-left font-medium"
                    >
                      SIGN OUT
                    </button>
                  </div>
                }
              >
                <div
                  className={classNames(
                    "w-[40px] h-[40px] overflow-hidden cursor-pointer rounded-full border-2 object-contain",
                    {
                      "border-indigo-300": accountMenu,
                      "border-gray-200": !accountMenu,
                    }
                  )}
                  onClick={() => setAccountMenu(!accountMenu)}
                >
                  <img
                    className="object-cover w-full h-full"
                    alt="profile picture"
                    src={
                      session.data?.user?.image ??
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                  />
                </div>
              </Popover>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
