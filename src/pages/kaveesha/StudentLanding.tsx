import Navbar from "../../components/kaveesha/Navbar";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GlassPage from "../../components/ui/GlassPage";

type Level = "basic" | "intermediate" | "advanced";

export default function StudentLearningLanding() {
  const nav = useNavigate();
  const [level, setLevel] = useState<Level>("basic");

  const [userName, setUserName] = useState<string>("");

  const handleSaveName = () => {
    if (userName.trim()) {
      localStorage.setItem("studentName", userName);
      alert("Name saved successfully!");
    }
  };

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

          <div className="mb-8 flex gap-3 justify-center">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-4 py-3 rounded-full border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSaveName}
              className="px-6 py-3 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
            >
              Save Name
            </button>
          </div>
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
            <span className="mx-5"></span>
            <button
              onClick={() => nav("/lessons")}
              className="px-14 py-4 rounded-full text-lg font-bold
             bg-white text-orange-600 border-2 border-orange-400
             hover:bg-orange-50 transition"
            >
              Lessons 📘
            </button>
          </div>
        </div>
      </section>
    </GlassPage>
  );
}
