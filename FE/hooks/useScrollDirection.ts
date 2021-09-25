import { useEffect, useState } from "react";

export enum ScrollDirection {
  UP = "up",
  DOWN = "down",
}

interface Props {
  initialDirection: ScrollDirection;
  thresholdPixels?: number;
  off?: boolean;
  event?: (scrollY: number, direction: ScrollDirection) => void;
}

const useScrollDirection = ({
  initialDirection,
  thresholdPixels = 0,
  off,
  event,
}: Props) => {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(initialDirection);

  useEffect(() => {
    const threshold = thresholdPixels;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }

      const direction =
        scrollY > lastScrollY ? ScrollDirection.DOWN : ScrollDirection.UP;

      event && event(scrollY, direction);
      setScrollDir(direction);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    /**
     * Bind the scroll handler if `off` is set to false.
     * If `off` is set to true reset the scroll direction.
     */
    !off
      ? window.addEventListener("scroll", onScroll)
      : setScrollDir(initialDirection);

    return () => window.removeEventListener("scroll", onScroll);
  }, [initialDirection, thresholdPixels, off, event]);

  return scrollDir;
};

export default useScrollDirection;
