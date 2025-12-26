import Navbar from "../../components/kaveesha/Navbar";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Level = "basic" | "intermediate" | "advanced";

export default function StudentLearningLanding() {
  const nav = useNavigate();
  const [level, setLevel] = useState<Level>("basic");

  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      <Navbar />

      <section className="relative max-w-6xl mx-auto px-4 py-12">
        {/* floating glows */}
        <div className="absolute top-12 left-12 w-28 h-28 bg-pink-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-24 right-16 w-36 h-36 bg-yellow-300/30 rounded-full blur-2xl animate-pulse" />

        <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-5xl p-6 sm:p-14">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
            <span className="text-orange-600">Choose</span>{" "}
            <span className="text-pink-500">Learning Level</span>
          </h2>

          <p className="text-center text-gray-700 mb-10">
            Pick the level that best matches your child’s ability 💛
          </p>

          {/* Level Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* BASIC */}
            <div
              onClick={() => setLevel("basic")}
              className={`
                cursor-pointer rounded-2xl p-6 text-center shadow-md transition
                ${
                  level === "basic"
                    ? "bg-orange-200/80 ring-4 ring-orange-400"
                    : "bg-yellow-200/70 hover:bg-yellow-300/70"
                }
              `}
            >
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-bold text-xl mb-2">Basic</h3>
              <p className="text-sm text-gray-700">
                Alphabets, numbers, simple words & emotions
              </p>
              <p className="text-xs mt-3 text-gray-600">
                MCQ images • Text → Video
              </p>
            </div>

            {/* INTERMEDIATE */}
            <div
              onClick={() => setLevel("intermediate")}
              className={`
                cursor-pointer rounded-2xl p-6 text-center shadow-md transition
                ${
                  level === "intermediate"
                    ? "bg-blue-200/80 ring-4 ring-blue-400"
                    : "bg-blue-200/60 hover:bg-blue-300/70"
                }
              `}
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-xl mb-2">Intermediate</h3>
              <p className="text-sm text-gray-700">
                Actions, short sentences & daily communication
              </p>
              <p className="text-xs mt-3 text-gray-600">
                Text → Video • Video → Text
              </p>
            </div>

            {/* ADVANCED */}
            <div
              onClick={() => setLevel("advanced")}
              className={`
                cursor-pointer rounded-2xl p-6 text-center shadow-md transition
                ${
                  level === "advanced"
                    ? "bg-pink-200/80 ring-4 ring-pink-400"
                    : "bg-pink-200/60 hover:bg-pink-300/70"
                }
              `}
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-xl mb-2">Advanced</h3>
              <p className="text-sm text-gray-700">
                Long sentences & role-play conversations
              </p>
              <p className="text-xs mt-3 text-gray-600">
                Video → Text • Sign → Sign
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <PrimaryButton onClick={() => nav(`/learn/${level}`)}>
              Start Learning ✨
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
