import Navbar from "../components/Navbar";
import EmotionTile from "../components/EmotionTile";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Instructions() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  return (
    // <div className="min-h-screen overflow-hidden bg-gradient-to-br from-peach via-orange-100 to-pink-100">
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      <Navbar />

      <section className="relative max-w-5xl mx-auto px-4 py-12">
        {/* soft floating glows */}
        <div className="absolute top-10 left-10 w-28 h-28 bg-pink-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-24 right-16 w-36 h-32 bg-yellow-300/30 rounded-full blur-2xl animate-pulse" />

        <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-5xl p-6 sm:p-15">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
            <span className="text-orange-600">Important</span>{" "}
            <span className="text-pink-500">Instructions</span>
          </h2>

          <p className="text-center text-gray-700 mb-6">
            Please help your child follow these steps before starting 💛
          </p>

          {/* instruction cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-200/70 rounded-2xl p-4 text-center shadow-md">
              👦 Sit in front of the camera
            </div>
            <div className="bg-blue-200/70 rounded-2xl p-4 text-center shadow-md">
              🚫 Don’t close or switch windows
            </div>
            <div className="bg-pink-200/70 rounded-2xl p-4 text-center shadow-md">
              🎬 Watch all videos fully
            </div>
          </div>

          {/* emotion preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
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

          {/* email input */}
          <div className="max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guardian@email.com"
              className="
                w-full
                p-4
                rounded-full
                border-2 border-orange-300
                focus:outline-none
                focus:ring-4 focus:ring-orange-200
                text-center
              "
            />

            <div className="mt-6 flex justify-center">
              <PrimaryButton
                disabled={!email.includes("@")}
                onClick={() => nav("/emotion", { state: { email } })}
              >
                Start Emotion Check 🚀
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
