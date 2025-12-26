import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Category1_MCQ from "../../../components/kaveesha/quiz/Category1_MCQ";
import Category2_TextToVideo from "../../../components/kaveesha/quiz/Category2_TextToVideo";
import Category3_VideoToText from "../../../components/kaveesha/quiz/Category3_VideoToText";
import Category4_SignToSign from "../../../components/kaveesha/quiz/Category4_SignToSign";

export default function QuizEngine() {
  const { level } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [catIndex, setCatIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    fetch(`/src/utils/kaveesha/${level}_level.json`)
      .then((res) => res.json())
      .then(setData);
  }, [level]);

  if (!data) return <div className="p-10">Loading quiz…</div>;

  const categoryOrder =
    level === "basic"
      ? ["category_1", "category_2"]
      : level === "intermediate"
      ? ["category_2", "category_3"]
      : ["category_3", "category_4"];

  const currentCategoryKey = categoryOrder[catIndex];
  const questions = data.categories[currentCategoryKey];
  const question = questions[qIndex];

  function next() {
    if (qIndex + 1 < questions.length) {
      setQIndex((prev) => prev + 1);
      return;
    }
    if (catIndex + 1 < categoryOrder.length) {
      setCatIndex((prev) => prev + 1);
      setQIndex(0);
      return;
    }

    navigate(`/results`);
  }

  const props = { question, onNext: next };

  switch (currentCategoryKey) {
    case "category_1":
      return <Category1_MCQ {...props} />;
    case "category_2":
      return <Category2_TextToVideo {...props} />;
    case "category_3":
      return <Category3_VideoToText {...props} />;
    case "category_4":
      return <Category4_SignToSign {...props} />;
    default:
      return null;
  }
}
