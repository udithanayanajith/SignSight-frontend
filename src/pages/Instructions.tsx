import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Instructions() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const isValid = /\S+@\S+\.\S+/.test(email);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Instructions for Parents 👨‍👩‍👧</h2>

        <ul className="list-disc pl-5 space-y-2 text-sm mb-6">
          <li>Child must sit in front of the laptop camera</li>
          <li>Do not close or switch windows during videos</li>
          <li>Each video must play fully</li>
          <li>Ensure good lighting</li>
        </ul>

        <input
          type="email"
          placeholder="Enter parent/guardian email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          disabled={!isValid}
          onClick={() => nav("/session")}
          className={`w-full py-3 rounded text-white ${
            isValid ? "bg-primary" : "bg-gray-300"
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
