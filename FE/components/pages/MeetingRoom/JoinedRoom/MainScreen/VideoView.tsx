import classNames from "classnames";
import React, { useEffect, useRef } from "react";

export const VideoView = React.memo(
  ({
    track,
    isScreen,
  }: {
    track: MediaStreamTrack | null;
    isScreen: boolean;
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (!track) {
        console.log("no track");
      } else {
        const stream = new MediaStream();

        stream.addTrack(track);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }, [track]);

    if (!track) return null;

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        className={classNames("absolute w-full h-full z-40", {
          "object-contain object-top": isScreen,
          "object-cover": !isScreen,
        })}
      />
    );
  }
);

VideoView.displayName = "VideoView";
