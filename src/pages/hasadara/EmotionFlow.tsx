import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Countdown from "../../components/hasadara/Countdown";
import ProgressIndicator from "../../components/hasadara/ProgressIndicator";
import CameraBubble from "../../components/hasadara/CameraBubble";

import { useCamera } from "../hooks/useCamera";
import { enterFullscreen, exitFullscreen } from "../utils/fullscreen";

const videos = [
  "https://www.youtube.com/embed/0yBnIUX0QAE",
  "https://www.youtube.com/embed/0yBnIUX0QAE",
  "https://www.youtube.com/embed/0yBnIUX0QAE",
];

export default function EmotionFlow() {
  const navigate = useNavigate();
  const location = useLocation();

  const guardianEmail = location.state?.email as string | undefined;

  useEffect(() => {
    if (!guardianEmail) {
      navigate("/instructions", { replace: true });
    }
  }, [guardianEmail, navigate]);

  if (!guardianEmail) return null;

  const email = guardianEmail;

  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const cameraStreamRef = useCamera(true);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    enterFullscreen();
    return () => exitFullscreen();
  }, []);

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => e.preventDefault();
    window.addEventListener("keydown", blockKeys);
    return () => window.removeEventListener("keydown", blockKeys);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (countdown !== 0) return;
    if (!cameraStreamRef.current) return;

    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(cameraStreamRef.current);

    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorderRef.current.start();

    return () => recorderRef.current?.stop();
  }, [countdown, cameraStreamRef]);

  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stop();

    recorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      const formData = new FormData();
      formData.append("email", email);
      formData.append("step", step.toString());
      formData.append("video", blob, `emotion_${step}.webm`);

      fetch("http://localhost:5000/upload-emotion-video", {
        method: "POST",
        body: formData,
      });

      chunksRef.current = [];
    };
  };

  const nextStep = () => {
    stopRecording();
    setStep((s) => s + 1);
    setCountdown(3);
  };

  useEffect(() => {
    if (step >= videos.length) {
      navigate("/result", { replace: true });
    }
  }, [step, navigate]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStreamRef]);

  if (step >= videos.length) return null;

  return (
    <>
      <CameraBubble stream={cameraStreamRef.current} />

      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-peach to-yellow-100 px-4 py-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <ProgressIndicator current={step + 1} total={videos.length} />

          {countdown > 0 ? (
            <Countdown value={countdown} />
          ) : (
            <>
              <iframe
                src={`${videos[step]}?autoplay=1`}
                className="w-full aspect-video rounded-3xl shadow-xl"
                style={{
                  width: "100%",
                  height: "600px",
                  maxHeight: "80vh",
                }}
                allow="autoplay"
              />

              <button
                onClick={nextStep}
                className="mt-8 px-6 py-3 bg-red-400 text-white rounded-full shadow-lg"
              >
                Next (Dev)
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
