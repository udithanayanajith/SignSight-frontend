import { useState } from "react";
import Countdown from "../components/Countdown";

const videos = [
  { emotion: "Happy", url: "https://www.youtube.com/embed/ZbZSe6N_BXs" },
  { emotion: "Sad", url: "https://www.youtube.com/embed/ho9rZjlsyYY" },
  { emotion: "Angry", url: "https://www.youtube.com/embed/9D05ej8u-gU" },
];

export default function EmotionSession() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  if (step >= videos.length) {
    window.location.href = "/done";
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!started ? (
        <Countdown onFinish={() => setStarted(true)} />
      ) : (
        <>
          <h2 className="text-2xl mb-4">{videos[step].emotion} Video</h2>
          <iframe
            className="w-[80%] h-[400px] rounded-xl"
            src={videos[step].url}
            allow="autoplay"
          />
          <button
            onClick={() => {
              setStarted(false);
              setStep(step + 1);
            }}
            className="mt-6 bg-primary text-white px-6 py-2 rounded"
          >
            Video Finished
          </button>
        </>
      )}
    </div>
  );
}
