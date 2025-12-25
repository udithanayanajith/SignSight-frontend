import { useEffect, useRef } from "react";

type Props = {
  stream: MediaStream | null;
};

export default function CameraBubble({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <div className="fixed bottom-6 right-6 w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg bg-black z-50">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
