import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import createPortalRoot from "../../../utils/createPortalRoot";

type DrawerPosition = "left" | "right";

export interface DrawerProps {
  isOpen: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose: () => any;
  position?: DrawerPosition;
  removeWhenClosed?: boolean;
}

const Drawer = ({
  isOpen,
  children,
  className,
  onClose,
  position = "left",
  removeWhenClosed = true,
}: DrawerProps) => {
  const bodyRef = useRef<HTMLBodyElement | null>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [animationEnd, setAnimationEnd] = useState(false);

  useEffect(() => {
    const updatePageScroll = () => {
      if (bodyRef.current) {
        if (isOpen) {
          bodyRef.current.style.overflow = "hidden";
        } else {
          bodyRef.current.style.overflow = "";
        }
      }
    };
    updatePageScroll();
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
    bodyRef.current = document.querySelector("body");
    portalRootRef.current =
      document.getElementById("portal-root") ?? createPortalRoot();
    if (bodyRef.current) {
      bodyRef.current.appendChild(portalRootRef.current);
      const portal = portalRootRef.current;
      const bodyEl = bodyRef.current;
      return () => {
        // Clean up the portal when drawer component unmounts
        portal.remove();
        // Ensure scroll overflow is removed
        bodyEl.style.overflow = "";
      };
    }
  }, []);

  if (removeWhenClosed && !isOpen && animationEnd) return null;

  return !mounted
    ? null
    : createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                onAnimationStart={() => {
                  removeWhenClosed && setAnimationEnd(false);
                }}
                onAnimationEnd={() => {
                  removeWhenClosed && setAnimationEnd(true);
                }}
                key="asdasdasd"
                aria-hidden={isOpen ? "false" : "true"}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                className={classNames(className, "fixed top-0 z-50 h-screen", {
                  "right-0": position === "right",
                  "left-0": position === "left",
                })}
              >
                {children}
              </motion.div>{" "}
              <motion.div
                key="asdasdsacascascasd"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.25,
                }}
                onClick={onClose}
                className="fixed inset-0 bg-black/30 z-40"
              />
            </>
          )}
        </AnimatePresence>,
        portalRootRef.current
      );
};

export default Drawer;
