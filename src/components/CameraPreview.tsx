type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

export default function CameraPreview({ videoRef }: Props) {
  return (
    <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-lg border-4 border-primary">
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
