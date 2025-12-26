import { useEffect, useState } from "react";
import { toYoutubeEmbed } from "../../../utils/kaveesha/youtube";

export default function Category2_TextToVideo({ question, onNext }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setSelectedIndex(null);
  }, [question.id]);

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-peach via-orange-100 to-pink-100 flex flex-col">
      {/* QUESTION */}
      <div className="pt-6 pb-3 text-center">
        <h2 className="text-3xl font-extrabold text-pink-500">
          {question.question}
        </h2>

        {/* PROGRESS DOTS */}
        <div className="flex justify-center gap-2 mt-3">
          {question.options.map((_: any, i: number) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition
                ${i === activeIndex ? "bg-pink-500 scale-110" : "bg-pink-200"}`}
            />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-6 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6">
          {/* 🎬 MAIN VIDEO */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl p-2 flex flex-col ring-4 ring-pink-300 max-h-[80vh]">
            <iframe
              src={toYoutubeEmbed(question.options[activeIndex].video)}
              className="w-full aspect-video rounded-2xl max-h-[60vh]"
              allowFullScreen
            />

            <button
              onClick={() => setSelectedIndex(activeIndex)}
              className={`
                mt-4 py-2 px-6 rounded-full text-lg font-bold
                inline-block
                transition-all duration-300  w-[800px] max-w-full text-center ml-[2.8rem]
                ${
                  selectedIndex === activeIndex
                    ? "bg-green-500 text-white scale-105"
                    : "bg-pink-500 text-white hover:bg-pink-600 hover:scale-105"
                }
              `}
            >
              {selectedIndex === activeIndex
                ? "Selected ✓"
                : "Select this answer"}
            </button>
          </div>

          {/* 👉 RIGHT VIDEO RAIL */}
          <div className="hidden lg:flex flex-col gap-3 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-xl p-3">
            {question.options.map((opt: any, i: number) => (
              <button
                key={opt.id}
                onClick={() => setActiveIndex(i)}
                className={`
                  relative rounded-xl overflow-hidden aspect-video
                  transition-all duration-300
                  ${
                    i === activeIndex
                      ? "ring-4 ring-pink-400 scale-105"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }
                `}
              >
                <iframe
                  src={toYoutubeEmbed(opt.video)}
                  className="w-full h-full pointer-events-none"
                />

                {/* PLAY ICON */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-pink-500/90 rounded-full flex items-center justify-center text-white text-lg animate-pulse">
                    ▶
                  </div>
                </div>

                {/* SELECTED BADGE */}
                {selectedIndex === i && (
                  <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center text-white text-3xl font-extrabold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="pb-6 flex justify-center">
        <button
          disabled={selectedIndex === null}
          onClick={onNext}
          className="
          px-24 py-4 rounded-full text-xl font-extrabold
          bg-gradient-to-r from-pink-500 to-orange-500
          text-white shadow-xl
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:scale-105 transition-all
          ml-[-15rem]
          "
        >
          Next →
        </button>
      </div>
    </div>
  );
}
