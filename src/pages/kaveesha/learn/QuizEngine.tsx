import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Category1_MCQ from "../../../components/kaveesha/quiz/Category1_MCQ";
import Category2_TextToVideo from "../../../components/kaveesha/quiz/Category2_TextToVideo";
import Category3_VideoToText from "../../../components/kaveesha/quiz/Category3_VideoToText";
import Category4_SignToSign from "../../../components/kaveesha/quiz/Category4_SignToSign";
import GlassPage from "../../../components/ui/GlassPage";
import { resetAnswers, useAppDispatch, useAppSelector } from "../../../store";
import { selectResultsByLevel } from "../../../store/selectors";
import { submitLevelResults } from "../../../services/submitLevelResults";

function FullScreenLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "5px solid white",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ color: "white", marginTop: 12 }}>Submitting results…</p>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default function QuizEngine() {
  const questions = useAppSelector((state) => state.questions);
  console.log("questions", questions);

  const { level } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [catIndex, setCatIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const results = useAppSelector(selectResultsByLevel(level as any));
  const dispatch = useAppDispatch();
  const [cat4File, setCat4File] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/src/utils/kaveesha/${level}_level.json`)
      .then((r) => r.json())
      .then(setData);
  }, [level]);

  if (!data)
    return (
      <GlassPage>
        <div className="p-20 text-center">Loading…</div>
      </GlassPage>
    );

  const order =
    level === "basic"
      ? ["category_1", "category_2"]
      : level === "intermediate"
        ? ["category_2", "category_3"]
        : ["category_3", "category_4"];

  const category = order[catIndex];
  const question = data.categories[category][qIndex];

  const props = {
    question,
    level,
    category,
    onNext: next,
    onVideoRecorded: setCat4File,
    disabled: isLoading,
  };

  async function next() {
    if (isLoading) return;

    const isLastQuestion =
      qIndex + 1 === data.categories[order[catIndex]].length;

    const isLastCategory = catIndex + 1 === order.length;

    if (!isLastQuestion) {
      setQIndex(qIndex + 1);
      return;
    }

    if (!isLastCategory) {
      setCatIndex(catIndex + 1);
      setQIndex(0);
      return;
    }

    try {
      setIsLoading(true);

      // 🔥 CRITICAL LINE — forces UI repaint
      await new Promise((r) => setTimeout(r, 2000));

      await submitLevelResults({
        user_id: "USER_123",
        level: level as string,
        quizzes: results,
        cat4File: cat4File as File,
      });

      // dispatch(resetAnswers());
      // navigate("/results");
    } catch (err) {
      console.error(err);
      setError("Failed to submit results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <FullScreenLoader />}

      <GlassPage>
        {
          {
            category_1: <Category1_MCQ {...props} />,
            category_2: <Category2_TextToVideo {...props} />,
            category_3: <Category3_VideoToText {...props} />,
            category_4: (
              <Category4_SignToSign {...props} onVideoRecorded={setCat4File} />
            ),
          }[order[catIndex]]
        }

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}
      </GlassPage>
    </>
  );
}
