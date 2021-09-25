import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import useScrollDirection, {
  ScrollDirection,
} from "../../../hooks/useScrollDirection";

enum NavbarState {
  TOP = "top",
  VISIBLE = "visible",
  HIDDEN = "hidden",
}

export const Navbar = () => {
  const [navbarState, setNavbarState] = useState<NavbarState>(NavbarState.TOP);

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

  return (
    <div
      className={classNames(
        "flex-center fixed top-0 w-screen transition-all duration-150",
        {
          "bg-transparent text-white": navbarState === NavbarState.TOP,
          "-translate-y-full": navbarState === NavbarState.HIDDEN,
          "bg-white translate-y-0 text-black shadow-sm":
            navbarState === NavbarState.VISIBLE,
        }
      )}
    >
      <div className="w-full flex justify-between mx-auto max-w-7xl py-4">
        <div>Icon</div>
        <div className="flex text-[15px] font-semibold items-center">
          <Link href="/features">
            <a className="mr-10">Features</a>
          </Link>
          <Link href="/pricing">
            <a className="mr-10">Pricing</a>
          </Link>
          <Link href="/support">
            <a className="mr-10">Support</a>
          </Link>
          <Link href="/signin">
            <a className="text-emerald-500 bg-emerald-50 py-2 px-6 rounded-lg mr-5">
              Log In
            </a>
          </Link>
          <Link href="/signup">
            <a
              className={classNames("ring-2 py-2 px-6 rounded-sm", {
                "ring-white": navbarState === NavbarState.TOP,
                "text-blue-600 ring-blue-600":
                  navbarState === NavbarState.VISIBLE,
              })}
            >
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
