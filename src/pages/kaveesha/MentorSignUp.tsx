import Navbar from "../../components/kaveesha/Navbar";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MentorSignup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);

  function toggleExpertise(level: string) {
    setExpertise((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }

  function handleSignup() {
    // TODO: backend mentor creation
    nav("/mentor/login");
  }

  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      <Navbar />

      <section className="relative max-w-xl mx-auto px-4">
        {/* glows */}
        <div className="absolute top-0 left-12 w-28 h-28 bg-yellow-300/30 blur-2xl rounded-full animate-pulse" />
        <div className="absolute bottom-24 right-14 w-36 h-36 bg-pink-300/30 blur-2xl rounded-full animate-pulse" />

        <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-5xl p- sm:p-12">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            <span className="text-orange-600">Mentor</span>{" "}
            <span className="text-pink-500">Sign Up</span>
          </h2>

          <p className="text-center text-gray-700 mb-8">
            Help children learn sign language 🌈
          </p>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full p-4 rounded-full border-2 border-yellow-300
                focus:outline-none focus:ring-4 focus:ring-yellow-200
                text-center
              "
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full p-4 rounded-full border-2 border-orange-300
                focus:outline-none focus:ring-4 focus:ring-orange-200
                text-center
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full p-4 rounded-full border-2 border-pink-300
                focus:outline-none focus:ring-4 focus:ring-pink-200
                text-center
              "
            />

            {/* Expertise */}
            <div className="text-center">
              <p className="font-semibold mb-3 text-gray-700">
                Teaching Levels
              </p>
              <div className="flex justify-center gap-3">
                {["Basic", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleExpertise(level)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition
                      ${
                        expertise.includes(level)
                          ? "bg-pink-400 text-white"
                          : "bg-white/60 text-gray-700"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <PrimaryButton
                disabled={
                  name.length < 2 ||
                  !email.includes("@") ||
                  password.length < 4 ||
                  expertise.length === 0
                }
                onClick={handleSignup}
              >
                Create Mentor Account ✨
              </PrimaryButton>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already a mentor?{" "}
              <span
                onClick={() => nav("/mentor/login")}
                className="text-pink-500 font-semibold cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
