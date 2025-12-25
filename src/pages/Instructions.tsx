import Navbar from "../components/Navbar";
import EmotionTile from "../components/EmotionTile";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Instructions() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-5">
        <div className="w-full max-w-4xl">
          <div
            className="
              p-6 sm:p-8
              rounded-[2.5rem]
              shadow-xl
              bg-white/40 backdrop-blur
              max-h-[calc(100dvh-120px)]
            "
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              Important Instructions
            </h2>

            <ul className="space-y-2 sm:space-y-3 text-center text-gray-700">
              <li className="bg-yellow-200/60 p-3 rounded-xl">
                👦 Sit in front of the camera
              </li>
              <li className="bg-blue-200/60 p-3 rounded-xl">
                🚫 Don’t close or switch windows
              </li>
              <li className="bg-pink-200/60 p-3 rounded-xl">
                🎬 Watch all videos fully
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <EmotionTile
                emoji="😊"
                label="Happy"
                gradient="from-yellow-300 to-orange-400"
              />
              <EmotionTile
                emoji="😢"
                label="Sad"
                gradient="from-blue-300 to-cyan-400"
              />
              <EmotionTile
                emoji="😠"
                label="Angry"
                gradient="from-red-300 to-pink-400"
              />
            </div>

            <input
              className="w-full mt-4 sm:mt-6 p-3 sm:p-4 rounded-full border-2 border-orange-300"
              placeholder="guardian@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="mt-4 text-center">
              <PrimaryButton
                disabled={!email.includes("@")}
                onClick={() => nav("/emotion")}
              >
                Get Started 🚀
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
