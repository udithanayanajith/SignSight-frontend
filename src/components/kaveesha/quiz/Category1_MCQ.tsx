import { useEffect, useState } from "react";

export default function Category1_MCQ({ question, onNext }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  // ✅ RESET selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4">
      <h2 className="text-center text-3xl font-extrabold mb-10 text-orange-600">
        {question.question}
      </h2>

      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {question.options.map((opt: any) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`
              relative rounded-3xl p-4 bg-white/70 backdrop-blur-xl
              shadow-lg transition-all duration-300
              ${
                selected === opt.id
                  ? "ring-4 ring-orange-400 scale-105"
                  : "hover:scale-105"
              }
            `}
          >
            <img
              src={opt.image}
              alt=""
              className="w-full h-44 object-contain"
            />

            <div className="absolute bottom-2 right-2 text-xl font-bold text-orange-500">
              {opt.id}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          disabled={!selected}
          onClick={onNext}
          className="
            px-14 py-4 rounded-full
            bg-orange-500 text-white text-xl font-bold
            disabled:bg-gray-300 disabled:cursor-not-allowed
          "
        >
          Next →
        </button>
      </div>
    </div>
  );
}
