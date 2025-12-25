import { useRef, useState } from "react";

export function useCameraRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);

  const startCameraAndRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopCameraAndRecording = (): Blob | null => {
    if (!mediaRecorderRef.current || !videoRef.current) return null;

    mediaRecorderRef.current.stop();

    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());

    setRecording(false);

    return new Blob(chunksRef.current, { type: "video/webm" });
  };

  return {
    videoRef,
    recording,
    startCameraAndRecording,
    stopCameraAndRecording,
  };
}
