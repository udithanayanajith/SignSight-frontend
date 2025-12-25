import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Countdown from "../components/Countdown";
import ProgressIndicator from "../components/ProgressIndicator";
import CameraBubble from "../components/CameraBubble";

import { useCamera } from "../hooks/useCamera";
import { enterFullscreen, exitFullscreen } from "../utils/fullscreen";

const videos = [
  "https://www.youtube.com/embed/0yBnIUX0QAE",
  "https://www.youtube.com/embed/0yBnIUX0QAE",
  "https://www.youtube.com/embed/0yBnIUX0QAE",
];

export default function EmotionFlow() {
  const navigate = useNavigate();

  // ─────────────────────────────
  // State
  // ─────────────────────────────
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(3);

  // ─────────────────────────────
  // Camera + Recording
  // ─────────────────────────────
  const cameraStreamRef = useCamera(true);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ─────────────────────────────
  // Fullscreen lock
  // ─────────────────────────────
  useEffect(() => {
    enterFullscreen();
    return () => exitFullscreen();
  }, []);

  // ─────────────────────────────
  // Disable keyboard navigation
  // ─────────────────────────────
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => e.preventDefault();
    window.addEventListener("keydown", blockKeys);
    return () => window.removeEventListener("keydown", blockKeys);
  }, []);

  // ─────────────────────────────
  // Countdown logic
  // ─────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─────────────────────────────
  // Start recording when countdown ends
  // ─────────────────────────────
  useEffect(() => {
    if (countdown !== 0) return;
    if (!cameraStreamRef.current) return;

    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(cameraStreamRef.current);

    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorderRef.current.start();

    return () => {
      recorderRef.current?.stop();
    };
  }, [countdown, cameraStreamRef]);

  // ─────────────────────────────
  // Stop recording safely
  // ─────────────────────────────
  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stop();

    recorderRef.current.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, {
        type: "video/webm",
      });

      // 🔗 TODO: upload to backend
      // uploadEmotionVideo(videoBlob, step);

      chunksRef.current = [];
    };
  };

  // ─────────────────────────────
  // Go to next emotion
  // ─────────────────────────────
  const nextStep = () => {
    stopRecording();
    setStep((s) => s + 1);
    setCountdown(3);
  };

  // ─────────────────────────────
  // Finish flow
  // ─────────────────────────────
  useEffect(() => {
    if (step >= videos.length) {
      navigate("/result");
    }
  }, [step, navigate]);

  // ─────────────────────────────
  // Cleanup EVERYTHING on leave
  // ─────────────────────────────
  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStreamRef]);

  if (step >= videos.length) return null;

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <>
      <CameraBubble stream={cameraStreamRef.current} />

      <div className="h-dvh bg-gradient-to-br from-peach to-yellow-100 flex flex-col items-center justify-center overflow-hidden px-4">
        <ProgressIndicator current={step + 1} total={videos.length} />

        {countdown > 0 ? (
          <Countdown value={countdown} />
        ) : (
          <>
            <iframe
              src={`${videos[step]}?autoplay=1`}
              className="w-full max-w-3xl aspect-video rounded-3xl shadow-xl"
              allow="autoplay"
            />

            {/* DEV ONLY */}
            <button
              onClick={nextStep}
              className="mt-6 px-6 py-3 bg-red-400 text-white rounded-full shadow-lg"
            >
              Next (Dev)
            </button>
          </>
        )}
      </div>
    </>
  );
}
