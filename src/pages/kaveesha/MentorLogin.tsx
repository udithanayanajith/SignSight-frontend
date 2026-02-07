import Navbar from "../../components/hasadara/Navbar";
import PrimaryButton from "../../components/hasadara/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function MentorLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setError("");
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("mentorEmail", email);
      nav("/mentorDash");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function getFirebaseErrorMessage(error: any) {
    const code = error?.code || "";

    switch (code) {
      case "auth/user-not-found":
        return "No mentor account found 👀";
      case "auth/wrong-password":
        return "Incorrect password 🔑";
      case "auth/invalid-email":
        return "Invalid email address ✉️";
      case "auth/network-request-failed":
        return "Network error. Try again 🌐";
      default:
        return "Login failed. Please try again 😕";
    }
  }

  function Loader() {
    return (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
                disabled={
                  loading || !email.includes("@") || password.length < 6
                }
                onClick={handleLogin}
              >
                {loading ? <Loader /> : "Login as Mentor 🚀"}
              </PrimaryButton>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              New mentor?{" "}
              <span
                onClick={() => nav("/mentor/signup")}
                className="text-pink-500 font-semibold cursor-pointer underline"
              >
                Create an account
              </span>
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              Are you an admin?{" "}
              <span
                onClick={() => nav("/admin/login")}
                className="cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
