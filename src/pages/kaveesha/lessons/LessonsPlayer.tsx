import { useParams, useNavigate } from "react-router-dom";
import { LESSONS_CONFIG } from "../../../config/lessonsConfig";
import Navbar from "../../../components/kaveesha/Navbar";
import LessonBackground from "../../../components/ui/LessonBackground";

export default function LessonPlayer() {
  const { category, item } = useParams();
  const nav = useNavigate();

  if (!category || !item) return null;

  const config = LESSONS_CONFIG[category];
  if (!config) return <p>Invalid category</p>;

  const index = config.order.indexOf(item);
  if (index === -1) return <p>Invalid item</p>;

  const nextItem = config.order[index + 1];
  const file = config.files[item];
  const src = `/lessons/${config.folder}/${file}`;

  return (
    <>
      <LessonBackground>
        <div className="min-h-screen bg-peach flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold mb-6 capitalize">{item}</h1>

          {config.type === "video" ? (
            <video
              src={src}
              controls
              autoPlay
              className="w-full max-w-4xl rounded-3xl shadow-xl"
            />
          ) : (
            <img src={src} className="max-h-[400px] rounded-3xl shadow-xl" />
          )}

          <div className="mt-8 flex gap-6">
            <button
              onClick={() => nav("/lessons")}
              className="px-6 py-3 rounded-full bg-gray-200"
            >
              Back
            </button>

            {nextItem && (
              <button
                onClick={() => nav(`/lessons/${category}/${nextItem}`)}
                className="px-10 py-3 rounded-full bg-orange-500 text-white font-bold"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </LessonBackground>
    </>
  );
}
