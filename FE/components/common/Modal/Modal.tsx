import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import createPortalRoot from "../../../utils/createPortalRoot";

export interface ModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose: () => any;
  removeWhenClosed?: boolean;
}

const Modal = ({
  isOpen,
  children,
  className,
  onClose,
  removeWhenClosed = true,
}: ModalProps) => {
  const bodyRef = useRef<HTMLBodyElement | null>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [animationEnd, setAnimationEnd] = useState(false);

  useEffect(() => {
    setMounted(true);
    bodyRef.current = document.querySelector("body");
    portalRootRef.current =
      document.getElementById("portal-root") ?? createPortalRoot();
    if (bodyRef.current) {
      bodyRef.current.appendChild(portalRootRef.current);
      const portal = portalRootRef.current;
      // const bodyEl = bodyRef.current;
      // return () => {
      //   // Clean up the portal when drawer component unmounts
      //   // portal.remove();
      //   // Ensure scroll overflow is removed
      //   // bodyEl.style.overflow = "";
      // };
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
                key="modal"
                aria-hidden={isOpen ? "false" : "true"}
                initial={{ opacity: 0.3, y: 100 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    bounce: 0,
                    damping: 20,
                    stiffness: 400,
                    mass: 0.2,
                  },
                }}
                exit={{
                  opacity: 0.8,
                  transition: { duration: 0.1 },
                }}
                className={classNames(
                  className,
                  "fixed top-0 z-50 left-1/2 -translate-x-1/2"
                )}
              >
                {children}
              </motion.div>
              <motion.div
                key="ewvewvwevsdv"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    type: "keyframes",
                    duration: 0.1,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.1 },
                }}
                onClick={onClose}
                className="fixed inset-0 bg-black/30 z-40"
              />
            </>
          )}
        </AnimatePresence>,
        portalRootRef.current as Element
      );
};

export default Modal;
