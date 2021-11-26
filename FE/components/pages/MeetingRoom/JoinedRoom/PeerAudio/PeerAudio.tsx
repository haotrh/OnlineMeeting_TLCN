import { useEffect, useRef } from "react";

export const PeerAudio = ({ audioTrack }: { audioTrack: MediaStreamTrack }) => {
  const audioRef = useRef<HTMLAudioElement>({} as HTMLAudioElement);

  useEffect(() => {
    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);

      audioRef.current.srcObject = stream;
      audioRef.current.volume = 1.0;
    } else {
      audioRef.current.srcObject = null;
    }
  }, [audioTrack]);

  return <audio ref={audioRef} autoPlay />;
};
