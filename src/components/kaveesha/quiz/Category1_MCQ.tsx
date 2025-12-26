import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Category1_MCQ({ question, onNext }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setSelected(null), [question.id]);

  return (
    <motion.div className="px-6 py-12">
      <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-10">
        {question.question}
      </h2>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {question.options.map((o: any) => (
          <button
            key={o.id}
            onClick={() => setSelected(o.id)}
            className={`
              rounded-3xl p-4 bg-white/70 backdrop-blur shadow-lg transition
              hover:scale-105
              ${selected === o.id ? "ring-4 ring-orange-400 scale-105" : ""}
            `}
          >
            <img src={o.image} className="h-44 mx-auto object-contain" />
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          disabled={!selected}
          onClick={onNext}
          className="px-16 py-4 rounded-full text-xl font-bold text-white
                     bg-gradient-to-r from-orange-500 to-pink-500
                     disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}
