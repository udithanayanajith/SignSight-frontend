import Navbar from "../components/Navbar";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const nav = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 overflow-hidden">
      <Navbar />

      {/* soft background glows */}
      <div className="absolute top-24 left-24 w-72 h-72 bg-green-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-24 right-24 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        {/* illustration-style card */}
        <div className="bg-white/50 backdrop-blur-xl rounded-[3rem] shadow-2xl px-8 py-12 max-w-xl w-full">
          <div className="text-6xl mb-6">😊</div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700">
            Session Completed
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Your child has successfully completed the emotion activity.
          </p>

          <p className="mt-2 text-gray-600">
            📧 A detailed emotion report has been sent to the guardian’s email.
          </p>

          <div className="mt-8">
            <PrimaryButton onClick={() => nav("/")}>
              Back to Home 🌈
            </PrimaryButton>
          </div>
        </div>

        {/* gentle footer message */}
        <p className="mt-10 text-sm text-gray-500 max-w-md">
          Thank you for helping us understand children’s emotions in a safe and
          caring way 💛
        </p>
      </main>
    </div>
  );
}
