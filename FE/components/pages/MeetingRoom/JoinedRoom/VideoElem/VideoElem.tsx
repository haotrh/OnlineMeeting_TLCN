import { useEffect, useRef } from "react";

interface VideoElemProps {
  stream: MediaStream;
}

const VideoElem = ({ stream }: VideoElemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return <video ref={videoRef} playsInline={false} autoPlay={true} />;
};

export default VideoElem;
