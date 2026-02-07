import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../components/kaveesha/PrimaryButton";

export default function ResultPage() {
  const nav = useNavigate();
  const { level } = useParams();

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-peach via-orange-100 to-pink-100 px-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-pink-500 mb-4">
          🎉 Level Completed!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          You have successfully completed the <b>{level}</b> level.
        </p>

        <div className="space-y-4">
          <PrimaryButton onClick={() => nav("/student/landing")}>
            Back to Levels
          </PrimaryButton>

          <button
            onClick={() => nav(`/learn/${level}`)}
            className="block w-full text-sm text-pink-600 underline"
          >
            Retry Level
          </button>
        </div>
      </div>
    </div>
  );
}
