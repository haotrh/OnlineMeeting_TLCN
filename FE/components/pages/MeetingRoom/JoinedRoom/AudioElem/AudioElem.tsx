import { useEffect, useRef } from "react";

interface AudioElemProps {
  stream: MediaStream;
}

const AudioElem = ({ stream }: AudioElemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return (
    <video
      className="hidden"
      ref={videoRef}
      playsInline={false}
      autoPlay={true}
    />
  );
};

export default AudioElem;
