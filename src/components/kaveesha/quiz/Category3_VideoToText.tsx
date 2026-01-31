import { useEffect, useState } from "react";
import YoutubePlayer from "./YoutubePlayer";
import { addAnswerForQuestion, useAppDispatch } from "../../../store";

export default function Category3_VideoToText({
  question,
  level,
  category,
  onNext,
}: any) {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  function handleSelect(opt: any) {
    setSelected(opt.id);

    dispatch(
      addAnswerForQuestion({
        level,
        category,
        question_id: question.id,
        correct_answer: question.correct_answer, // ✅ FIX
        user_answer: opt.id,
        area: question.area,
      }),
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-peach via-orange-100 to-pink-100">
      <div className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* VIDEO */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-4">
            <p className="text-center text-sm text-gray-600 mb-3">
              Watch the sign and choose the correct meaning
            </p>
            <YoutubePlayer url={question.question_video} />
          </div>

          {/* OPTIONS */}
          <div className="flex flex-col justify-center space-y-4">
            {question.options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`
                  w-full px-6 py-4 rounded-full text-lg font-semibold text-left
                  transition-all
                  ${
                    selected === opt.id
                      ? "bg-purple-500 text-white shadow-lg scale-[1.02]"
                      : "bg-white hover:bg-purple-50"
                  }
                `}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEXT */}
      <div className="bg-white/90 border-t py-4 flex justify-center">
        <button
          disabled={!selected}
          onClick={onNext}
          className={`px-20 py-4 rounded-full text-xl font-bold
            ${
              selected
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
