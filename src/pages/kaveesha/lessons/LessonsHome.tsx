import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonBackground from "../../../components/ui/LessonBackground";
import CategoryIntroModal from "../../../components/kaveesha/lessons/CategoryIntroModal";
import Navbar from "../../../components/kaveesha/Navbar";

type Category = "colors" | "food" | "numbers";

export default function LessonsHome() {
  const nav = useNavigate();
  const [open, setOpen] = useState<Category | null>(null);

  /* ---------- DATA ---------- */

  const COLORS = [
    { label: "Black", value: "black", color: "#000000" },
    { label: "Blue", value: "blue", color: "#2563EB" },
    { label: "Brown", value: "brown", color: "#92400E" },
    { label: "Green", value: "green", color: "#16A34A" },
    { label: "Grey", value: "grey", color: "#6B7280" },
    {
      label: "Light & Dark Green",
      value: "Light & Dark Green",
      color: "#6B8078",
    },
    { label: "Orange", value: "orange", color: "#F97316" },
    { label: "Pink", value: "pink", color: "#EC4899" },
    { label: "Red", value: "red", color: "#DC2626" },
    { label: "White", value: "white", color: "#FFFFFF" },
    { label: "Yellow", value: "yellow", color: "#FACC15" },
  ];

  const FOOD = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
  ];

  const NUMBERS = Array.from({ length: 10 }).map((_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  /* ---------- UI ---------- */

  return (
    <>
      <Navbar />
      <LessonBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-3">
            Lessons 📘
          </h1>

          <p className="text-gray-700 text-center mb-12">
            Choose a category to start learning
          </p>

          {/* CATEGORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <CategoryCard
              emoji="🎨"
              title="Colors"
              onClick={() => setOpen("colors")}
            />

            <CategoryCard
              emoji="🍽️"
              title="Food"
              onClick={() => setOpen("food")}
            />

            <CategoryCard
              emoji="🔢"
              title="Numbers"
              onClick={() => setOpen("numbers")}
            />
          </div>
        </div>

        {/* ---------- MODALS ---------- */}

        {open === "colors" && (
          <CategoryIntroModal
            category="colors"
            title="Colors"
            introVideo="/lessons/Colors/Colors Intro.mp4"
            items={COLORS}
            onClose={() => setOpen(null)}
            onNext={(item) => nav(`/lessons/colors/${item.value}`)}
          />
        )}

        {open === "food" && (
          <CategoryIntroModal
            category="food"
            title="Food"
            introVideo="/lessons/Food/Food Items Intro.mp4"
            items={FOOD}
            onClose={() => setOpen(null)}
            onNext={(item) => nav(`/lessons/food/${item.value}`)}
          />
        )}

        {open === "numbers" && (
          <CategoryIntroModal
            category="numbers"
            title="Numbers"
            introVideo="/lessons/Numbers/1.png" // optional intro
            items={NUMBERS}
            onClose={() => setOpen(null)}
            onNext={(item) => nav(`/lessons/numbers/${item.value}`)}
          />
        )}
      </LessonBackground>
    </>
  );
}

/* ---------- CARD COMPONENT ---------- */

function CategoryCard({
  emoji,
  title,
  onClick,
}: {
  emoji: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white/80 backdrop-blur-xl
        rounded-[2.5rem]
        shadow-2xl
        p-10
        flex flex-col items-center
        transition-all
        hover:scale-105
        active:scale-95
      "
    >
      <div className="text-6xl mb-5">{emoji}</div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </button>
  );
}
