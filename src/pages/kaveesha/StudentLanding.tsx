import Navbar from "../../components/kaveesha/Navbar";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GlassPage from "../../components/ui/GlassPage";

type Level = "basic" | "intermediate" | "advanced";

export default function StudentLearningLanding() {
  const nav = useNavigate();
  const [level, setLevel] = useState<Level>("basic");

  return (
    <GlassPage>
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] shadow-glass p-10">
          <h2 className="text-4xl font-extrabold text-center mb-3">
            <span className="text-orange-600">Choose</span>{" "}
            <span className="text-pink-500">Learning Level</span>
          </h2>

          <p className="text-center text-gray-600 mb-10">
            Learn sign language step by step 💛
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { id: "basic", emoji: "🌱", color: "orange" },
              { id: "intermediate", emoji: "🚀", color: "blue" },
              { id: "advanced", emoji: "🏆", color: "pink" },
            ].map((l: any) => (
              <div
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`
                  cursor-pointer p-6 rounded-3xl text-center transition-all
                  bg-white/70 backdrop-blur shadow-lg
                  hover:scale-105
                  ${level === l.id ? `ring-4 ring-${l.color}-400` : ""}
                `}
              >
                <div className="text-4xl mb-3">{l.emoji}</div>
                <h3 className="font-bold text-xl capitalize">{l.id}</h3>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <PrimaryButton onClick={() => nav(`/learn/${level}`)}>
              Start Learning ✨
            </PrimaryButton>
          </div>
        </div>
      </section>
    </GlassPage>
  );
}
