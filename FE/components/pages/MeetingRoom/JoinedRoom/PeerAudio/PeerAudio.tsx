import { useEffect, useRef } from "react";

export const PeerAudio = ({ audioTrack }: { audioTrack: MediaStreamTrack }) => {
  const audioRef = useRef<HTMLAudioElement>({} as HTMLAudioElement);

  useEffect(() => {
    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);

      audioRef.current.srcObject = stream;
    } else {
      audioRef.current.srcObject = null;
    }
  }, [audioTrack]);

  return <audio ref={audioRef} autoPlay />;
};
