import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../hooks/redux";
import { MemorizedPeerView as PeerView } from "./PeerView";
import { useResizeDetector } from "react-resize-detector";
import { MeView } from "./MeView";
import { RoomContext } from "../../../../contexts/RoomContext";
import { MeScreen } from "./MeScreen";

const FILL_RATE = 0.95;

const SidebarView = () => {
  const peersRef = useRef<HTMLDivElement>(null);
  const spotlights = useAppSelector((selector) => selector.room.spotlights);
  const [peerSize, setPeerSize] = useState({ width: 0, height: 0 });
  const pin = useAppSelector((selector) => selector.room.pin);
  const { screenProducer } = useContext(RoomContext);

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

      let x, y, space;

      for (let rows = 1; rows <= n; rows++) {
        x = width / Math.ceil(n / rows);
        y = x / aspectRatio;

        if (height < y * rows) {
          y = height / rows;
          x = aspectRatio * y;

          break;
        }

        space = height - y * rows;

        if (space < y) break;
      }

      if (
        Math.ceil(peerSize.width) !== Math.ceil(FILL_RATE * (x as number)) ||
        Math.ceil(peerSize.height) !== Math.ceil(FILL_RATE * (y as number))
      ) {
        setPeerSize({
          width: FILL_RATE * (x as number),
          height: FILL_RATE * (y as number),
        });
      }
    }
  }, [spotlights.length, screenProducer]);

  useEffect(() => {
    updateDimension();
  }, [spotlights.length, screenProducer]);

  return (
    <div className="absolute inset-0">
      <div
        ref={peersRef}
        className="w-full h-full flex-center relative flex-wrap transition-all"
      >
        <MeView style={{ width: peerSize.width, height: peerSize.height }} />
        {screenProducer && (
          <MeScreen
            style={{ width: peerSize.width, height: peerSize.height }}
          />
        )}
        {spotlights.map((spotlight, index) => (
          <PeerView
            isPinned={pin === "otherpeer" && index === 0}
            style={{ width: 218, height: 123 }}
            peerId={spotlight.peerId}
            type={spotlight.type}
            key={`peerview${spotlight.type + spotlight.peerId}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarView;
