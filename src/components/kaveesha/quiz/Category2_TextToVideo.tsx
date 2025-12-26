import { useEffect, useState } from "react";
import { toYoutubeEmbed } from "../../../utils/kaveesha/youtube";

export default function Category2_TextToVideo({ question, onNext }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      {/* 🔝 QUESTION (FIXED HEIGHT) */}
      <div className="px-4 pt-6 pb-4 text-center shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-500">
          {question.question}
        </h2>
      </div>

      {/* 📜 OPTIONS (SCROLLABLE ONLY AREA) */}
      <div className="flex-1 overflow-y-auto px-4 pb-36">
        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {question.options.map((opt: any) => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`
                cursor-pointer rounded-3xl p-4 bg-white/70 backdrop-blur-xl
                shadow-lg transition-all
                ${
                  selected === opt.id
                    ? "ring-4 ring-pink-400 scale-[1.02]"
                    : "hover:scale-[1.02]"
                }
              `}
            >
              <iframe
                src={toYoutubeEmbed(opt.video)}
                className="w-full aspect-video rounded-2xl mb-4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              <div
                className={`
                  text-center py-3 rounded-full font-bold text-lg
                  ${
                    selected === opt.id
                      ? "bg-pink-500 text-white"
                      : "bg-pink-100 text-pink-600"
                  }
                `}
              >
                Select
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⬇️ NEXT BUTTON (FIXED BOTTOM BAR) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-pink-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            disabled={!selected}
            onClick={onNext}
            className="
              w-full sm:w-auto sm:mx-auto block
              px-16 py-4 rounded-full text-xl font-bold
              bg-pink-500 text-white
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition
            "
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
