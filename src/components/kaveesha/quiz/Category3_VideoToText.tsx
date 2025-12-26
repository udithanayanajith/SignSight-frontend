import { useEffect, useState } from "react";
import YoutubePlayer from "./YoutubePlayer";

export default function Category3_VideoToText({ question, onNext }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      {/* 🧠 MAIN CONTENT */}
      <div className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 🎬 LEFT: VIDEO */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-4">
            <p className="text-center text-sm text-gray-600 mb-3">
              Watch the sign and choose the correct meaning
            </p>

            <div className="rounded-2xl overflow-hidden bg-gray-100">
              <YoutubePlayer url={question.question_video} />
            </div>
          </div>

          {/* 📝 RIGHT: ANSWERS */}
          <div className="flex flex-col justify-center space-y-4">
            {question.options.map((opt: any) => {
              const isSelected = selected === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`
                    w-full px-6 py-4 rounded-full text-lg font-semibold
                    transition-all duration-200 text-left
                    ${
                      isSelected
                        ? "bg-purple-500 text-white shadow-lg scale-[1.02]"
                        : "bg-white hover:bg-purple-50"
                    }
                  `}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⬇️ BOTTOM NEXT BUTTON */}
      <div className="shrink-0 bg-white/90 backdrop-blur-xl border-t">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center">
          <button
            disabled={!selected}
            onClick={onNext}
            className={`
              px-20 py-4 rounded-full text-xl font-bold transition
              ${
                selected
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
