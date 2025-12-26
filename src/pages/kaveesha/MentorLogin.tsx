import Navbar from "../../components/kaveesha/Navbar";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MentorLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // TODO: backend mentor auth
    nav("/mentor/dashboard");
  }

  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      <Navbar />

      <section className="relative max-w-xl mx-auto px-4 py-20">
        {/* glows */}
        <div className="absolute top-10 left-10 w-28 h-28 bg-pink-300/30 blur-2xl rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-12 w-32 h-32 bg-yellow-300/30 blur-2xl rounded-full animate-pulse" />

        <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-5xl p-8 sm:p-12">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            <span className="text-orange-600">Mentor</span>{" "}
            <span className="text-pink-500">Login</span>
          </h2>

          <p className="text-center text-gray-700 mb-8">
            Welcome back 💛 Let’s guide young learners
          </p>

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Mentor Email"
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

            <div className="flex justify-center pt-4">
              <PrimaryButton
                disabled={!email.includes("@") || password.length < 4}
                onClick={handleLogin}
              >
                Login as Mentor 🚀
              </PrimaryButton>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              New mentor?{" "}
              <span
                onClick={() => nav("/mentor/signup")}
                className="text-pink-500 font-semibold cursor-pointer underline"
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
