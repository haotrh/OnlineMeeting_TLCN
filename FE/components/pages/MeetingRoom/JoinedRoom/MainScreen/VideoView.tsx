import React, { useEffect, useRef } from "react";

export const VideoView = React.memo(
  ({ track }: { track: MediaStreamTrack | null }) => {
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
        className="absolute w-full h-full z-40 object-cover"
      />
    );
  }
);

VideoView.displayName = "VideoView";
