import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 bg-white shadow flex justify-between">
        <h1 className="font-bold text-xl text-primary">EmotionSense</h1>
        <button
          onClick={() => nav("/instructions")}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Find Emotions
        </button>
      </nav>

      <main className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h2 className="text-4xl font-bold mb-4">
          Understand Your Child’s Emotions 💙
        </h2>
        <p className="max-w-xl mb-6">
          A safe and friendly system designed to help deaf children express
          emotions through visual engagement.
        </p>
        <button
          onClick={() => nav("/instructions")}
          className="bg-primary text-white px-10 py-4 rounded-full text-lg"
        >
          Get Started
        </button>
      </main>
    </div>
  );
}
