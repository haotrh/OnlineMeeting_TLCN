import classNames from "classnames";
import React from "react";
import { Peer } from "../../../../../types/room.type";
import PeerVolume from "./PeerBackdropVolume";

interface PeerBackdropProps {
  peer: Peer;
}

const PeerBackdrop = React.memo(({ peer }: PeerBackdropProps) => {
  return (
    <div className={classNames("relative w-20 h-20")}>
      <img
        src={peer.picture}
        className="w-full h-full rounded-full relative z-10"
        alt="avatar"
      />
      <PeerVolume peerId={peer.id} />
    </div>
  );
});

PeerBackdrop.displayName = "PeerBackdrop";

export default PeerBackdrop;
