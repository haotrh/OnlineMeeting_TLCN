import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useScrollDirection, {
  ScrollDirection,
} from "../../../hooks/useScrollDirection";

enum NavbarState {
  TOP = "top",
  VISIBLE = "visible",
  HIDDEN = "hidden",
}

const Navbar = () => {
  const [navbarState, setNavbarState] = useState<NavbarState>(
    NavbarState.HIDDEN
  );

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
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
