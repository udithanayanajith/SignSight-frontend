import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

const API_URL = "http://localhost:5000";

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
  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    error?: string;
    videosCollected?: number;
    taskId?: string;
  }>({ uploading: false });

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

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    recorderRef.current.stop();

    recorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      const formData = new FormData();
      formData.append("email", email);
      formData.append("step", step.toString());
      formData.append("video", blob, `emotion_${step}.webm`);

      setUploadStatus({ uploading: true });

      try {
        console.log(`📤 Uploading video for step ${step}...`);

        const response = await fetch(`${API_URL}/upload-emotion-video`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Upload failed: ${response.status}`);
        }

        console.log(`✅ Upload successful:`, result);

        // Update status
        setUploadStatus({
          uploading: false,
          videosCollected: result.videos_collected,
          taskId: result.task_id,
        });

        // Check if processing started
        if (result.status === "processing_started") {
          console.log("🎉 All videos uploaded! Processing started.");
          console.log(`Task ID: ${result.task_id}`);

          // Optional: Show success message or navigate to results page
          // You could store taskId in localStorage or state to check later
          localStorage.setItem("lastTaskId", result.task_id);
        } else {
          console.log(`📊 Progress: ${result.videos_collected}/3 videos`);
        }
      } catch (error) {
        console.error(`❌ Upload error:`, error);
        setUploadStatus({
          uploading: false,
          error: error instanceof Error ? error.message : "Upload failed",
        });

        // Optional: Show error to user or retry
        alert(
          `Failed to upload video: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        chunksRef.current = [];
      }
    };
  };

  const nextStep = () => {
    stopRecording();
    setStep((s) => s + 1);
    setCountdown(3);
    setUploadStatus({ uploading: false }); // Reset upload status
  };

  useEffect(() => {
    if (step >= videos.length) {
      // Check if we have a task ID to show results
      const taskId = localStorage.getItem("lastTaskId");
      if (taskId) {
        navigate("/result", { replace: true, state: { taskId } });
      } else {
        navigate("/result", { replace: true });
      }
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

          {/* Upload Status Indicator */}
          {uploadStatus.uploading && (
            <div className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              📤 Uploading video...
            </div>
          )}

          {uploadStatus.error && (
            <div className="mb-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              ❌ {uploadStatus.error}
            </div>
          )}

          {uploadStatus.videosCollected !== undefined &&
            !uploadStatus.uploading && (
              <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                ✅ Video uploaded! ({uploadStatus.videosCollected}/3 collected)
              </div>
            )}

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
                disabled={uploadStatus.uploading}
                className={`mt-8 px-6 py-3 rounded-full shadow-lg transition-all ${
                  uploadStatus.uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-400 hover:bg-red-500 text-white"
                }`}
              >
                {uploadStatus.uploading ? "Uploading..." : "Next"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
