import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function login() {
    if (username === "admin" && password === "admin123") {
      nav("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl space-y-4 w-80">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={login}
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
