import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <nav
      className="
        w-full
        bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400
        shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => nav("/")}
        >
          <div className="bg-white/30 backdrop-blur rounded-full p-2">
            <span className="text-2xl">😊</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold tracking-wide">
            EmotiSense
          </h1>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => nav("/")}
            className="text-white text-lg font-semibold hover:underline"
          >
            Home
          </button>

          <button
            onClick={() => nav("/instructions")}
            className="text-white text-lg font-semibold hover:underline"
          >
            Instructions
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => nav("/instructions")}
          className="
            ml-4 px-6 py-2
            bg-white text-orange-500
            rounded-full font-bold
            shadow-md
            hover:scale-105 active:scale-95
            transition
          "
        >
          Start 🌈
        </button>
      </div>
    </nav>
  );
}
