import _ from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useAppSelector } from "../../../../../hooks/redux";
import { RoomContext } from "../../../../contexts/RoomContext";
import { MeScreen } from "./MeScreen";
import { MeView } from "./MeView";
import { MemorizedPeerView as PeerView } from "./PeerView";

//Fixed size for sidescreen when any screen is pinned
export const PINNED_SIDE_WIDTH = 240;
export const PINNED_SIDE_HEIGHT = 135;

export const MainScreen = () => {
  const peersRef = useRef<HTMLDivElement>(null);
  const spotlights = useAppSelector((selector) => selector.room.spotlights);
  const [screenStyle, setScreenStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    maxScreensPerRow: 0,
  });
  const pin = useAppSelector((selector) => selector.room.pin);
  const { screenProducer, changeMaxSpotlights } = useContext(RoomContext);

  useResizeDetector<HTMLDivElement>({
    onResize: () => {
      updateDimension();
    },
    targetRef: peersRef,
  });

  const updateDimension = useCallback(() => {
    if (peersRef.current) {
      const width = peersRef.current.clientWidth;
      const height = peersRef.current.clientHeight;
      const n = spotlights.length + 1 + (screenProducer ? 1 : 0);

      const aspectRatio = 1.777; //16:9
      let x = 0,
        y = 0,
        space = 0,
        left = 0,
        top = 0,
        maxScreensPerRow = 0,
        rows = 0;
      //When no screen pinned
      if (!pin) {
        for (rows = 1; rows <= n; rows++) {
          maxScreensPerRow = Math.ceil(n / rows);

          x = width / maxScreensPerRow;
          y = x / aspectRatio;

          if (height < y * rows) {
            y = height / rows;
            x = aspectRatio * y;
            break;
          }

          space = height - y * rows;

          if (space < y) {
            break;
          }
        }

        left =
          (width - (x * maxScreensPerRow + (maxScreensPerRow - 1) * 5)) / 2;

        top = (height - (y * rows + (rows - 1) * 10)) / 2;

        setScreenStyle({
          left: Math.ceil(left),
          top: Math.ceil(top),
          width: Math.ceil(x - (maxScreensPerRow === 1 ? 0 : 5)),
          height: Math.ceil(y - (rows === 1 ? 0 : 5)),
          maxScreensPerRow,
        });
      }
      //When any screen pinned
      else {
        //Only one screen - nothing on right bar
        if (n === 1) {
          setScreenStyle({
            left: 0,
            top: 0,
            width,
            height,
            maxScreensPerRow: 0,
          });
        }
        //Have sidescreen
        else {
          y = height;
          x = width - PINNED_SIDE_WIDTH - 10;

          let maxScreensOnSide = Math.floor(height / PINNED_SIDE_HEIGHT);

          if (
            height <
            PINNED_SIDE_HEIGHT * maxScreensOnSide + (maxScreensOnSide - 1) * 10
          )
            maxScreensOnSide--;

          changeMaxSpotlights(maxScreensOnSide + 1);

          setScreenStyle({
            left: 0,
            top: 0,
            width: x,
            height: y,
            maxScreensPerRow: 0,
          });
        }
      }
    }
  }, [spotlights.length, screenProducer, pin]);

  useEffect(() => {
    updateDimension();
  }, [spotlights.length, screenProducer, pin]);

  return (
    <div className="flex flex-col flex-auto relative w-full py-2">
      <div className="flex-grow relative">
        <div className="absolute inset-0">
          <div
            ref={peersRef}
            className="w-full h-full flex-center relative flex-wrap transition-all"
          >
            <MeView
              style={{
                width: screenStyle.width,
                height: screenStyle.height,
                left:
                  pin && pin !== "myview"
                    ? screenStyle.width + 10
                    : screenStyle.left,
                top: pin && pin !== "myview" ? 0 : screenStyle.top,
              }}
            />
            {screenProducer && (
              <MeScreen
                style={{
                  width: screenStyle.width,
                  height: screenStyle.height,
                  left:
                    pin && pin !== "myscreen"
                      ? screenStyle.width + 10
                      : screenStyle.left +
                        (screenStyle.maxScreensPerRow > 1
                          ? screenStyle.width + 10
                          : 0),
                  top: pin
                    ? pin !== "otherpeer"
                      ? 0
                      : PINNED_SIDE_HEIGHT + 10
                    : screenStyle.top +
                      (screenStyle.maxScreensPerRow === 1
                        ? screenStyle.height + 10
                        : 0),
                }}
              />
            )}
            {spotlights.map((spotlight, index) => {
              const col =
                (index + 1 + (screenProducer ? 1 : 0)) %
                screenStyle.maxScreensPerRow;

              const row = Math.floor(
                (index + 1 + (screenProducer ? 1 : 0)) /
                  screenStyle.maxScreensPerRow
              );

              const sidebarPosition =
                pin === "otherpeer"
                  ? 1 + (screenProducer ? 1 : 0) + index - 1
                  : index + (screenProducer ? 1 : 0);

              console.log(sidebarPosition);

              const isPinned = pin === "otherpeer" && index === 0;

              return (
                <PeerView
                  isPinned={isPinned}
                  style={{
                    width: screenStyle.width,
                    height: screenStyle.height,
                    left: isPinned
                      ? 0
                      : pin && !isPinned
                      ? screenStyle.width + 10
                      : screenStyle.left + (col * screenStyle.width + col * 10),
                    top: isPinned
                      ? 0
                      : pin && !isPinned
                      ? PINNED_SIDE_HEIGHT * sidebarPosition +
                        sidebarPosition * 10
                      : screenStyle.top + (row * screenStyle.height + row * 10),
                  }}
                  peerId={spotlight.peerId}
                  type={spotlight.type}
                  key={`peerview${spotlight.type + spotlight.peerId}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
