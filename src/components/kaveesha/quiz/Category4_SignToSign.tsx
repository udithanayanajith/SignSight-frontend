import { useEffect, useRef, useState } from "react";
import YoutubePlayer from "./YoutubePlayer";

export default function Category4_SignToSign({ question, onNext }: any) {
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  /* ================= CAMERA HELPERS ================= */

  async function openCamera() {
    const s = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    setStream(s);

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = s;
    }
  }

  function stopCamera() {
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }

    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  /* ================= RECORDING FLOW ================= */

  function startCountdown() {
    let count = 5;
    setCountdown(count);

    countdownRef.current = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        startRecording();
      }
    }, 1000);
  }

  function startRecording() {
    if (!stream) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedUrl(URL.createObjectURL(blob));
    };

    recorder.start();
    setRecording(true);
    setTimeLeft(30);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopRecording();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    recorderRef.current?.stop();
    setRecording(false);
    stopCamera(); // 🔴 CAMERA OFF
  }

  async function retake() {
    setRecordedUrl(null);
    setTimeLeft(30);
    await openCamera();
  }

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-peach via-orange-100 to-pink-100 px-6 py-8">
      <h2 className="text-center text-2xl font-extrabold text-gray-800 mb-6">
        {question.instruction}
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — QUESTION VIDEO */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-5">
          <YoutubePlayer url={question.question_video} />
        </div>

        {/* RIGHT — CAMERA / PLAYBACK */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center">
          {!recordedUrl ? (
            <>
              {/* LIVE CAMERA */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black">
                <video
                  ref={liveVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full aspect-video object-cover mirror"
                />

                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-7xl font-extrabold">
                    {countdown}
                  </div>
                )}

                {recording && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    🔴 {timeLeft}s
                  </div>
                )}

                {!stream && !recording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-lg">
                    Camera is off
                  </div>
                )}
              </div>

              {/* CONTROLS */}
              <div className="mt-6 flex gap-4">
                {!stream && (
                  <button
                    onClick={openCamera}
                    className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600"
                  >
                    📷 Open Camera
                  </button>
                )}

                {stream && !recording && countdown === null && (
                  <button
                    onClick={startCountdown}
                    className="px-8 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600"
                  >
                    🎥 Start Recording
                  </button>
                )}

                {recording && (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-3 rounded-full bg-gray-700 text-white font-bold"
                  >
                    ⛔ Stop
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ▶️ PLAYBACK */}
              <video
                src={recordedUrl}
                controls
                className="w-full aspect-video rounded-2xl shadow-md"
              />

              <div className="mt-6 flex gap-4">
                <button
                  onClick={retake}
                  className="px-6 py-3 rounded-full bg-gray-200 font-semibold hover:bg-gray-300"
                >
                  🔁 Retake
                </button>

                <button
                  onClick={onNext}
                  className="px-8 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600"
                >
                  ✅ Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
