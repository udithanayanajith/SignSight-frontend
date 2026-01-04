import { useState } from "react";

type Item = {
  label: string;
  value: string;
  color?: string;
};

type Props = {
  category: "colors" | "food" | "numbers";
  title: string;
  introVideo: string;
  items: Item[];
  onNext: (item: Item) => void;
  onClose: () => void;
};

export default function CategoryIntroModal({
  title,
  introVideo,
  items,
  onNext,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<Item | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      {/* MODAL */}
      <div
        className="
          bg-white
          rounded-[2rem]
          shadow-2xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* 🎬 VIDEO (NO CUT, RESPONSIVE) */}
        <div className="w-full bg-black flex justify-center items-center rounded-t-[2rem]">
          <video
            src={introVideo}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full max-h-[50vh] object-contain"
          />
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
            Choose {title}
          </h2>

          {/* OPTIONS */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 justify-items-center mb-10">
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelected(item)}
                className="flex flex-col items-center gap-2"
              >
                {item.color ? (
                  <div
                    className={`
                      w-16 h-16 rounded-full shadow-lg border-4 transition-all
                      ${
                        selected?.value === item.value
                          ? "border-orange-500 scale-110"
                          : "border-transparent"
                      }
                    `}
                    style={{ backgroundColor: item.color }}
                  />
                ) : (
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      text-xl font-bold shadow-lg bg-orange-100
                      ${
                        selected?.value === item.value
                          ? "ring-4 ring-orange-400 scale-110"
                          : ""
                      }
                    `}
                  >
                    {item.label}
                  </div>
                )}

                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="
                px-6 py-3 rounded-full
                bg-gray-200 hover:bg-gray-300
                font-semibold transition
              "
            >
              ⬅ Back
            </button>

            <button
              disabled={!selected}
              onClick={() => selected && onNext(selected)}
              className={`
                px-10 py-3 rounded-full text-lg font-bold transition-all
                ${
                  selected
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
